import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  CircularProgress, Container, Grid, Typography, Box, Alert, Paper
} from '@mui/material';
import { styled } from '@mui/system';

const ChartContainer = styled(Paper)({
  padding: '16px',
  boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
});

const ChartTitle = styled(Typography)({
  marginBottom: '16px',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
});

const ErrorContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
});

const fetchData = async (url, setData, setError, setLoading) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    setData(jsonData);
    setLoading(false);
  } catch (error) {
    console.error(`Error loading data from ${url}:`, error);
    setError(`Error loading data: ${error.message}`);
    setLoading(false);
  }
};

const Dashboard = () => {
  const [supplierSpending, setSupplierSpending] = useState([]);
  const [productQuantities, setProductQuantities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData('http://localhost:4000/supplier_spending', setSupplierSpending, setError, setLoading);
    fetchData('http://localhost:4000/product_quantities', setProductQuantities, setError, setLoading);
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <Alert severity="error">{error}</Alert>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h2" component="h2" gutterBottom>
        Purchase Order Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ChartContainer>
            <ChartTitle variant="h5" component="h3">
              Total Spending by Supplier
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierSpending}>
                <XAxis dataKey="supplier_name" label={{ value: 'Supplier', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Spending ($)', angle: -90, position: 'insideLeft' }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_spending" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer>
            <ChartTitle variant="h5" component="h3">
              Total Quantity by Product
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productQuantities}>
                <XAxis dataKey="product_name" label={{ value: 'Product', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_quantity" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

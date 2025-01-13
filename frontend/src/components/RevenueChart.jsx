import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    ToggleButton, 
    ToggleButtonGroup, 
    Typography,
    CircularProgress,
    useTheme,
    Fade,
    Zoom
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import orderApi from '../service/api/orderApi';

const RevenueChart = () => {
    const [period, setPeriod] = useState('month');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        fetchRevenueData();
    }, [period]);

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            const stats = await orderApi.getRevenueStats(period);
            const formattedData = formatChartData(stats);
            setData(formattedData);
        } catch (error) {
            console.error('Failed to fetch revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatChartData = (stats) => {
        const sortedStats = [...stats].sort((a, b) => {
            if (a._id.year !== b._id.year) {
                return a._id.year - b._id.year;
            }
            if (period === 'month' && a._id.month !== b._id.month) {
                return a._id.month - b._id.month;
            }
            if (period === 'quarter' && a._id.quarter !== b._id.quarter) {
                return a._id.quarter - b._id.quarter;
            }
            return 0;
        });

        return sortedStats.map(stat => {
            let label;
            if (period === 'month') {
                label = new Date(stat._id.year, stat._id.month - 1).toLocaleDateString('vi-VN', { 
                    month: 'short', 
                    year: 'numeric' 
                });
            } else if (period === 'quarter') {
                label = `Q${stat._id.quarter}/${stat._id.year}`;
            } else {
                label = stat._id.year.toString();
            }

            return {
                period: label,
                revenue: Math.round(stat.revenue / 1000000),
                orderCount: stat.orderCount
            };
        });
    };

    const getGradientId = () => 'barGradient';

    const CustomTooltip = ({ id, value, indexValue }) => (
        <Zoom in={true}>
            <Box
                sx={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(5px)'
                }}
            >
                <Typography variant="subtitle2" sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    mb: 0.5
                }}>
                    {indexValue}
                </Typography>
                <Typography variant="body2" sx={{ 
                    color: theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <span style={{ fontWeight: 600 }}>Doanh thu:</span>
                    <span style={{ color: theme.palette.success.main }}>
                        {value.toLocaleString()} triệu VNĐ
                    </span>
                </Typography>
            </Box>
        </Zoom>
    );

    return (
        <Paper 
            elevation={3}
            sx={{ 
                p: 3, 
                height: 500, 
                mb: 3,
                background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
                borderRadius: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: theme.palette.primary.main, 
                        fontWeight: 700,
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -4,
                            left: 0,
                            width: '40%',
                            height: 3,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 1
                        }
                    }}
                >
                    Biểu Đồ Doanh Thu
                </Typography>
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    onChange={(e, newPeriod) => newPeriod && setPeriod(newPeriod)}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            borderRadius: '20px!important',
                            px: 3,
                            py: 1,
                            mx: 0.5,
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: theme.palette.text.secondary,
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                }
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            }
                        }
                    }}
                >
                    <ToggleButton value="month">Tháng</ToggleButton>
                    <ToggleButton value="quarter">Quý</ToggleButton>
                    <ToggleButton value="year">Năm</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Fade in={!loading}>
                <Box sx={{ height: '400px', position: 'relative' }}>
                    <svg style={{ height: 0 }}>
                        <defs>
                            <linearGradient id={getGradientId()} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={theme.palette.primary.light} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                    </svg>
                    {!loading && (
                        <ResponsiveBar
                            data={data}
                            keys={['revenue']}
                            indexBy="period"
                            margin={{ top: 50, right: 30, bottom: 50, left: 80 }}
                            padding={0.3}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={`url(#${getGradientId()})`}
                            borderRadius={4}
                            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45,
                                legend: '',  // Removed "Thời gian" here
                                legendPosition: 'middle',
                                legendOffset: 45,
                                tickColor: theme.palette.text.secondary
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Triệu VNĐ',
                                legendPosition: 'middle',
                                legendOffset: -60,
                                tickColor: theme.palette.text.secondary
                            }}
                            enableLabel={true}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            animate={true}
                            motionConfig="gentle"
                            tooltip={CustomTooltip}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: theme.palette.text.secondary,
                                            fontSize: 12
                                        }
                                    },
                                    legend: {
                                        text: {
                                            fill: theme.palette.text.primary,
                                            fontSize: 13,
                                            fontWeight: 600
                                        }
                                    }
                                },
                                grid: {
                                    line: {
                                        stroke: theme.palette.divider,
                                        strokeWidth: 1,
                                        strokeDasharray: '4 4'
                                    }
                                }
                            }}
                        />
                    )}
                </Box>
            </Fade>

            {loading && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '400px' 
                }}>
                    <CircularProgress size={40} thickness={4} />
                </Box>
            )}
        </Paper>
    );
};

export default RevenueChart;

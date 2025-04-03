import React, { useRef, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet, pdf } from '@react-pdf/renderer';
import { Bar } from 'react-chartjs-2';
import { Button, Box } from '@mui/material';
import emailjs from '@emailjs/browser';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
//import { Send_Email_PDF } from './sendEmail'; // Import the new email sending function
import axios  from 'axios'; // Import axios for making HTTP requests


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { margin: 10, padding: 10 },
  header: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  chartSection: { margin: 20, padding: 10 },
  barContainer: { 
    flexDirection: 'row',  
    marginTop: 10,
    height: 100,
    justifyContent: 'space-around'
  },
  bar: {
    width: 40,
    marginHorizontal: 5,
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5
  },
  chartWrapper: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    padding: 10
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  axisLabel: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center'
  }
});

// Simple bar representation for PDF
const SimpleBarChart = ({ data }) => (
  <View>
    <Text style={styles.header}>Performance Trend</Text>
    <View style={styles.barContainer}>
      {data.map((value, index) => {
        const height = (value / 100) * 100; // Scale the height based on percentage
        return (
          <View key={index}>
            <View style={[styles.bar, { 
              height: `${height}%`,
              backgroundColor: index === 0 ? '#FF6384' : index === 1 ? '#36A2EB' : '#FFCE56',
            }]} />
            <Text style={styles.barLabel}>Game {index + 1}</Text>
            <Text style={styles.barLabel}>{value.toFixed(0)}%</Text>
          </View>
        );
      })}
    </View>
  </View>
);

// // Live preview chart component with updated configuration
// const PerformanceChart = ({ data }) => {
//   const chartRef = useRef(null);

//   const chartData = {
//     labels: ['Game 1', 'Game 2', 'Game 3'],
//     datasets: [{
//       label: 'Game Performance',
//       data: data,
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//       borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//       borderWidth: 1,
//     }]
//   };

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//         ticks: {
//           stepSize: 20, // Changed to 20 for 0,20,40,60,80,100
//           callback: function(value) {
//             return value; // Removed % symbol
//           }
//         },
//         grid: {
//           drawOnChartArea: true,
//           color: '#E0E0E0'
//         },
//         title: {
//           display: true,
//           text: 'Performance Score (%)',
//           font: {
//             size: 14,
//             color: '#666666'
//           }
//         }
//       },
//       x: {
//         grid: {
//           drawOnChartArea: true
//         },
//         title: {
//           display: true,
//           text: 'Games',
//           font: {
//             size: 14
//           }
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         display: true,
//         labels: {
//           usePointStyle: false, // Changed from true to false
//           boxWidth: 15,
//           boxHeight: 15,
//           color: '#666666', // Matching label color
//           font: {
//             size: 12,
//             color: '#666666'
//           },
//           generateLabels: (chart) => [{
//             text: 'Game Performance',
//             fillStyle: 'transparent',
//             strokeStyle: '#666666', // Matching label color
//             lineWidth: 1,
//             color: '#666666', // Added this to match label color
//             font: {
//               color: '#666666'
//             }
//           }]
//         }
//       },
//       title: {
//         color: '#666666',
//         font: {
//           color: '#666666'
//         }
//       }
//     }
//   };

//   return <Bar ref={chartRef} data={chartData} options={options} id="performance-chart" />;
// };


const PerformanceChart = ({ data }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: ['Game 1', 'Game 2', 'Game 3'],
    datasets: [{
      label: 'Game Performance',
      data: data,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      // borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderColor: ['white', 'white', 'white'], // Changed to white
      borderWidth: 1.5,
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20, // Changed to 20 for 0,20,40,60,80,100
          callback: function(value) {
            return value; // Removed % symbol
          }
        },
        grid: {
          drawOnChartArea: true,
          color: '#E0E0E0'
        },
        title: {
          display: true,
          text: 'Performance Score (%)',
          font: {
            size: 14,
            color: '#666666'
          }
        }
      },
      x: {
        grid: {
          drawOnChartArea: true
        },
        title: {
          display: true,
          text: 'Games',
          font: {
            size: 14
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: false, // Changed from true to false
          boxWidth: 15,
          boxHeight: 15,
          color: 'white', // Set label color to white
          font: {
            size: 12,
            color: 'white' // Set font color to white
          },
          generateLabels: (chart) => [{
            text: 'Game Performance',
            fillStyle: 'transparent', // Make the legend box transparent
            strokeStyle: 'white', //#666666 is equivalent to 'gray'
            lineWidth: 2,
            fontColor: '#FFFFFF', //#FFFFFF is equivalent to 'white'
            // font: {
            //   color: 'white'
            // }
          }]
        }
      },
      title: {
        color: 'white', // Set title color to white
        font: {
          size: 12,
          color: 'white' // Set font color to white
        }
      }
    }
  };

  return <Bar ref={chartRef} data={chartData} options={options} id="performance-chart" />;
};


const PDFDocument = ({ playerData, gameData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title}>
        <Text>Chess Performance Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Player Information</Text>
        <Text style={styles.text}>Name: {playerData.name}</Text>
        <Text style={styles.text}>Quiz Score: {playerData.quizScore}</Text>
        <Text style={styles.text}>Player Category: {playerData.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Game Statistics</Text>
        {gameData.map((game, index) => (
          <View key={index} style={[styles.section, { flexDirection: 'row' }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>Game {game.gameNumber}</Text>
              <Text style={styles.text}>Result: {game.result}</Text>
              <View style={{ flexDirection: 'row', gap: 2 }}>  {/* Reduced gap from 5 to 2 */}
                <View style={{ flex: 1, paddingRight: 5 }}>  {/* Added paddingRight */}
                  <Text style={[styles.text, { fontWeight: 'bold' }]}>White Statistics:</Text>
                  <Text style={styles.text}>•{'\u00A0'}Accuracy: {game.accuracy.white}%</Text>
                  <Text style={styles.text}>•{'\u00A0'}Blunders: {game.blunders.white}</Text>
                  <Text style={styles.text}>•{'\u00A0'}Mistakes: {game.mistakes.white}</Text>
                  <Text style={styles.text}>•{'\u00A0'}Inaccuracies: {game.inaccuracies.white}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>  {/* Added paddingLeft */}
                  <Text style={[styles.text, { fontWeight: 'bold' }]}>Black Statistics:</Text>
                  <Text style={styles.text}>•{'\u00A0'}Accuracy: {game.accuracy.black}%</Text>
                  <Text style={styles.text}>•{'\u00A0'}Blunders: {game.blunders.black}</Text>
                  <Text style={styles.text}>•{'\u00A0'}Mistakes: {game.mistakes.black}</Text>
                  <Text style={styles.text}>•{'\u00A0'}Inaccuracies: {game.inaccuracies.black}</Text>
                </View>
              </View>
              <Text style={[styles.text, { marginTop: 5 }]}>Overall Score: {game.overallScore.toFixed(2)}%</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.chartSection, { marginTop: 20 }]}>
        <Text style={styles.header}>Performance Trend</Text>
        {/* Y-axis label outside the chart */}
        <Text style={{
          position: 'absolute',
          left: -55,  // Moved further left
          top: '50%',
          transform: 'rotate(-90deg)',
          fontSize: 9,
          width: 100,
          textAlign: 'center'
        }}>Performance Score (%)</Text>
        
        <View style={{
          marginLeft: 60,  // Increased margin to accommodate y-axis label
          marginRight: 10,
          marginTop: 10,
          height: 180,
          borderLeftWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#666666'
        }}>
          {/* Y-axis labels with adjusted position */}
          <View style={{ 
            position: 'absolute', 
            left: -25, 
            top: 0, 
            height: '100%', 
            justifyContent: 'space-between',
            paddingRight: 5
          }}>
            {[100, 80, 60, 40, 20, 0].map(value => (
              <Text key={value} style={{ fontSize: 8 }}>{value}</Text>
            ))}
          </View>

          {/* Bars with increased width */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'flex-end',
            height: '100%',
            paddingBottom: 0,
            marginLeft: 20,
            width: '90%'  // Added to ensure bars use more space
          }}>
            {gameData.map((game, index) => (
              <View key={index} style={{
                alignItems: 'center',
                width: '25%'  // Increased from 20%
              }}>
                <View style={{
                  height: `${game.overallScore}%`,
                  width: 35,  // Increased from 25
                  backgroundColor: index === 0 ? '#FF6384' : index === 1 ? '#36A2EB' : '#FFCE56'
                }} />
                <Text style={{ fontSize: 8, marginTop: 5 }}>Game {index + 1}</Text>
              </View>
            ))}
          </View>

          {/* X-axis label */}
          <Text style={{
            position: 'absolute',
            bottom: -20,
            alignSelf: 'center',
            fontSize: 9
          }}>Games</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// const GameReport = ({ playerData, gameData }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     // Cleanup chart on unmount
//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', my: 2 }}>
//       <Box sx={{ width: '100%', maxWidth: 600 }}>
//         <PerformanceChart data={gameData.map(game => game.overallScore)} />
//       </Box>
      
//       <PDFDownloadLink
//         document={<PDFDocument playerData={playerData} gameData={gameData} />}
//         fileName="chess-performance-report.pdf"
//       >
//         {({ blob, url, loading, error }) =>
//           loading ? (
//             <Button variant="contained" disabled>Loading document...</Button>
//           ) : (
//             <Button variant="contained" sx={{backgroundColor: "#8E5C00", '&:hover': {background: 'rgba(255, 192, 8, 0.5)'}}}>
//               Download Report
//             </Button>
//           )
//         }
//       </PDFDownloadLink>
//     </Box>
//   );
// };




// const GameReport = ({ playerData, gameData }) => {
//   const chartRef = useRef(null);
//   const [isSending, setIsSending] = useState(false);

//   const sendPdfReport = async () => {
//     setIsSending(true);
//     try {
//       // Create PDF blob
//       const blob = await pdf(<PDFDocument playerData={playerData} gameData={gameData} />).toBlob();
//       // const blob = await pdf(
//       //   <Document>
//       //     <Page size="A4" style={styles.page}>
//       //       {/* Wrap content in Text components */}
//       //       <PDFDocument playerData={playerData} gameData={gameData} />
//       //     </Page>
//       //   </Document>
//       // ).toBlob();

//       // Convert blob to base64
//       const reader = new FileReader();

//       // Create a promise to handle the FileReader
//       const base64Promise = new Promise((resolve, reject) => {
//         reader.onloadend = () => resolve(reader.result);
//         reader.onerror = reject;
//       });
      
//       reader.readAsDataURL(blob);
      
//       //reader.onloadend = async () => {
//         //const base64data = reader.result;
    
//         // Wait for base64 conversion
//         const base64result = await base64Promise;
//         const base64data = base64result.split(',')[1]; // Remove data URL prefix

//         // const templateParams = {
//         //   to_email: 'kabalida271@gmail.com',
//         //   player_name: playerData?.name || 'Player',
//         //   date: new Date().toLocaleDateString(),
//         //   // attachment: {
//         //   //   data: base64data,
//         //   //   type: 'application/pdf',
//         //   //   name: 'chess-performance-report.pdf'
//         //   // },
//         //   // //pdf_data: base64data
//         //   // template_params: {
//         //   //   filename: 'chess-performance-report.pdf',
//         //   //   content: base64data
//         //   // }
//         //   //raw_pdf: base64data
//         //   // message: {
//         //   //   attachments: [{
//         //   //     content: base64data,
//         //   //     type: 'application/pdf',
//         //   //     name: 'chess-performance-report.pdf',
//         //   //     disposition: 'attachment'
//         //   //   }]
//         //   // }
//         //   pdf_base64: base64data
//         // };

//         // Send email using serverless function
//         // const response = await axios.post('/api/sendEmail', {
//         const response = await axios.post('/api/sendEmail', {
//           toEmail: 'kabalida271@gmail.com', // Replace with the target email
//           originalname: 'chess-performance-report.pdf',
//           base64data: base64data,
//           //name: playerData.name,
//           //quizScore: playerData.quizScore,
//           //category: playerData.category,
//         });

//         if (response.status === 200) {
//           alert('Report sent successfully!');
//         } else {
//           alert('Failed to send report. Please try again.');
//         }

//         // Send email using nodemailer
//         // const emailSent = await Send_Email_PDF(
//         //   'kabalida271@gmail.com', // Replace with the target email
//         //   'chess-performance-report.pdf',
//         //   Buffer.from(base64data, 'base64'), // Convert base64 to buffer
//         //   //playerData.name,
//         //   //playerData.quizScore,
//         //   //playerData.category,
//         //   //['gowthamrajvp0@gmail.com'] // CC emails
//         // );
//         // if (emailSent) {
//         //   alert('Report sent successfully!');
//         // } else {
//         //   alert('Failed to send report. Please try again.');
//         // }

//         // Send email using emailjs
//         // await emailjs.send(
//         //   'service_mok1kjl', // Replace with your EmailJS service ID
//         //   'template_hqt4zun', // Replace with your EmailJS template ID
//           // {
//           //   to_email: 'kabalida271@gmail.com', // Replace with the target email
//           //   pdf_attachment: base64data,
//           //   player_name: playerData.name,
//           //   date: new Date().toLocaleDateString(),
//           //   //content_type: 'application/pdf',
//           //   //filename: 'chess-performance-report.pdf'
//           //   attachment: {
//           //     data: base64data,
//           //     type: 'application/pdf',
//           //     name: 'chess-performance-report.pdf'
//           //   }
//           // },
//         //   templateParams,
//         //   'ZAFmbIbqe_FvrcU-y' // Replace with your EmailJS public key
//         // );

//         //alert('Report sent successfully!');
//       //};
//     } catch (error) {
//       console.error('Error sending report:', error);
//       alert('Failed to send report. Please try again.');
//     } finally {
//       setIsSending(false);
//     }
//   };

const GameReport = ({ playerData, gameData }) => {
  const chartRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const sendReport = async () => {
    setIsSending(true);
    try {
      const response = await axios.post('/api/sendEmailText', {
      //const response = await axios.post('https://cbemailapi.netlify.app/api/sendEmailText', {
        toEmail: 'Vishnu@machenn.com', //'jraju271@gmail.com', Replace with the target email if needed
        playerData,  // Ensure this has the actual user name (fetched from Firestore)
        gameData,
      });

      if (response.status === 200) {
        alert('Report sent successfully!');
      } else {
        alert('Failed to send report. Please try again.');
      }
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Failed to send report. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', my: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <PerformanceChart data={gameData.map(game => game.overallScore)} />
      </Box>
      
      <Button 
        variant="contained" 
        onClick={sendReport}
        disabled={isSending}
        sx={{
          backgroundColor: "#8E5C00", 
          '&:hover': {background: 'rgba(255, 192, 8, 0.5)'}
        }}
      >
        {isSending ? 'Sending Report...' : 'Send Report'}
      </Button>
    </Box>
  );
};

export default GameReport;

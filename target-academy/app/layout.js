export const metadata = {
  title: 'Target Coaching Academy — Result Analysis System',
  description: 'Secure result management portal for Target Coaching Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

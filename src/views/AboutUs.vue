<template>
    <div class="about-us-container">
      <h1 class="page-title">About PlentyCart</h1>
      <div class="about-us-content">
        <div class="about-section">
          <h2>Our Mission</h2>
          <p>
            At PlentyCart, our mission is to provide our customers with the best shopping experience for their fresh groceries and daily essentials. We believe in delivering high-quality products, exceptional customer service, and a convenient shopping platform.
          </p>
        </div>
        <div class="about-section">
          <h2>Our Story</h2>
          <p>
            PlentyCart was founded in 2018 with the goal of revolutionizing the way people shop for their groceries. We started as a small online store, but our dedication to customer satisfaction and our commitment to sustainable practices have helped us grow into a trusted brand in the industry.
          </p>
        </div>
        <div class="about-section">
          <h2>Our Values</h2>
          <ul>
            <li>Providing the highest quality products</li>
            <li>Ensuring customer satisfaction</li>
            <li>Promoting sustainable and eco-friendly practices</li>
            <li>Fostering a diverse and inclusive work environment</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutUs',
  }
  </script>
  
  <style scoped>
  .about-us-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .page-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 40px;
    padding-top: 3rem;
  }
  
  .about-us-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
  }
  
  .about-section {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .about-section h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  
  .about-section p, .about-section ul {
    color: #555;
    line-height: 1.6;
  }
  
  .about-section ul {
    padding-left: 20px;
  }
  </style>
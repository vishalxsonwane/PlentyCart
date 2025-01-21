<template>
    <header class="header">
      <div class="jumbotron text-center">
        <h1 class="display-4">Welcome to PlentyCart!</h1>
        <p class="lead">Fresh groceries delivered to your doorstep</p>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'TheHeader'
  }
  </script>
  
  <style scoped>
  .header {
    padding: 20px 0;
    background-color: #f8f9fa;
  }
  
  .jumbotron {
    background-color: transparent;
    margin-bottom: 0;
  }
  </style>
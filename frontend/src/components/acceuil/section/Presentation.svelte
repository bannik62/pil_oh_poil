<script>
  // Logic goes here
</script>


  <div class="container">
    <div class="left-section">
    </div>
    
    <div class="right-section">
        <div class="right-section-content">
            <h2>Bienvenue chez Pile Oh Poil !</h2>
            <p>l’élégance au bout des doigts, la détente au creux des mains!<br><br>
                Massage, onglerie, soins du visage…<br>
                 Offrez-vous un moment de bien-être sur-mesure.</p>
               
                 <div class="icone-spa">
                 </div>
        </div>  
    </div>
  </div>


<style>
  .container {
    margin-right: 100px;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 70px;
    border-radius: 30px;
    box-shadow: -5px 20px 20px rgba(55, 54, 54, 0.441);

}

.left-section {
    width: 50%;
    height: 102vh;
    background-color: var(--color-primary);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(../../../assets/img/massage2.png);
    border-radius: 10px 0 0 10px;
    box-shadow: 10px -2px 0 rgba(55, 54, 54, 0.441);
}

  .right-section {
    position: relative;
    width: 45%;
    height: auto;
    max-height: 93%;
    padding: 20px;
    border-radius: 0 10px 10px 0;
    box-shadow: 10px -2px 0 rgba(55, 54, 54, 0.441) inset;
    background-image: url(../../../assets/img/parquet.jpg);
    background-size: contain;
    background-repeat: repeat;
}

.icone-spa {
    width: 100%;
    margin: auto 35%;
    align-items: center;
    width: 100px;
    height: 100px;
    background-image: url(../../../assets/img/spa_accessories.png);
    background-size: cover;
    background-position: center;
}
.right-section-content {
    background-color: var(--color-secondary);
    height: auto;
    color: #fff;
    padding:10px;
    border-radius: 10px;
    box-shadow: 10px -2px 0 rgba(55, 54, 54, 0.441) 
  }
  .right-section-content h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 10px;
    text-decoration: underline;
    text-underline-offset: 10px;
  }
  .right-section-content p {
    display: flex;
    align-items: flex-start;
    font-size: 2.2rem;
    font-weight: 400;
    margin-bottom: 10px;
  }
  
  @media (max-width: 600px) {
    .container {
      flex-direction: column;
      height: auto;
    }

    .left-section {
      width: 100%;
      height: 300px;
      margin-bottom: 20px;
    }

    .right-section {
      width: 90%;
      margin: 0 auto;
    }
  }
  
</style>

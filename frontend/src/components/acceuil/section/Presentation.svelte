<script>
  // Logic goes here
</script>
<section id="presentation">
  <div class="container">
    <div class="left-section">
    </div>
    
    <div class="right-section">
        <div class="right-section-content">
            <h1>Bienvenue chez Pil Oh Poil !</h1>
            <p>l’élégance au bout des doigts, la détente au creux des mains!<br><br>
                Massage, onglerie, soins du visage…</p><br>
                 <p>Offrez-vous un moment de bien-être sur-mesure.</p>
               
                 <div class="icone-spa">
                 </div>
        </div>  
    </div>
  </div>
</section>

<style>
  .container {
    position: relative;
    padding: 10px;
    margin-right: 100px;
    width: 99%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items: center;
    margin-bottom: 60px;
    border-radius: 16px;
    box-shadow: 0 0px 30px 0 rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.left-section {
    width: 50%;
    height: 114vh;
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
    height: 80%;
    max-height: 93%;
    padding: 20px;
    border-radius: 0 10px 10px 0;
    box-shadow: 10px -2px 0 rgba(55, 54, 54, 0.441) inset;
    background-image: url(../../../assets/img/parquet.jpg);
    background-size: contain;
    background-repeat: repeat;
    z-index: 1;
}
.right-section h1 {
  font-family: 'Lavishly Yours', cursive;
}
.right-section p {
  font-family: 'Playfair Display', serif;
}
.icone-spa {
    width: 100%;
    margin: auto 50%;
    transform: translateX(-50%);
    align-items: center;
    width: 100px;
    height: 100px;
    background-image: url(../../../assets/img/spa_accessories.png);
    background-size: cover;
    background-position: center;
}
.right-section-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    background-color: var(--color-secondary);
    color: #fff;
    padding:60px;
    border-radius: 10px;
    box-shadow: 10px -2px 0 rgba(55, 54, 54, 0.441) 
  }

  .right-section-content p {
    display: flex;
    align-items: flex-start;
    font-size: clamp(1.2rem, 2vw, 3rem);
    font-weight: 400;
    margin-top: 30px;
  }
  @media (min-width: 375px) and (max-width: 389px) {
    .container {
      height: 190vh;
    }
    
    .right-section-content {
      height: 100%;
    }

  }
  @media (min-width: 390px) and (max-width: 391px) {
    .container {
      height: 190vh;
    }
    
    .right-section-content {
      height: 100%;
    }
  }

  @media  (max-width: 600px) {
    .container {
      flex-direction: column;
      height: auto;
      width: 90%;
      margin-bottom: 30px;
      margin: 0 auto;
        
    }

    .left-section {
      width: 100%;
      height: 300px;
      margin-bottom: 20px;
      box-shadow: none;
    }
    
    .right-section {
      width: 98%;
      height: 100;
      margin-bottom: 20px;
    }
    .right-section-content {
      height: 50%;
    }      

    .icone-spa {
      width: 50%;
      height: 80px;
    }
    
    
  }
  
</style>

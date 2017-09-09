<html ng-app="NightLife" class="wf-quicksand-n4-active wf-quicksand-n7-active wf-active"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <meta http-equiv="Content-Security-Policy" content="default-src gap://ready file://* *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com https://fonts.googleapis.com data:">
    <title>Appointment Booking Software | MyNyte Social</title>
    <meta name="description" content="Bedfordshire, Buckinghamshire &amp; London-based process server, legal courier &amp; legal document server.">
    <meta name="keywords" content="bedford, luton, london, buckinghamshire, process server, legal courier, data protection compliant, process agent, court order server, legal document server, process serving, processing agent, UK, MK40">

    <link href="css/outer-style-alt.css" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://webfonts.creativecloud.com/c/69721a/1w;quicksand,2,WXp:W:n4,WXn:W:n7/l" media="all">
    <link href="https://fonts.googleapis.com/css?family=Quicksand|Titillium+Web" rel="stylesheet">
    <link rel="stylesheet" href="https://webfonts.creativecloud.com/c/69721a/1w;quicksand,2,WXp:W:n4,WXn:W:n7/l" media="all"><script async="" src="https://www.google-analytics.com/analytics.js"></script><script src="https://webfonts.creativecloud.com/quicksand:n4,n7:default.js" type="text/javascript"></script>
    
    <script async="" src="https://www.google-analytics.com/analytics.js"></script>
    <script src="https://code.jquery.com/jquery-2.2.0.min.js" type="text/javascript"></script>
        
    <script src="js/main.js" type="text/javascript"></script>
    <script src='https://maps.googleapis.com/maps/api/js?sensor=false'></script>
  </head>

  <body class="contact-us">
    <div id="loader" class="slow-trans">
        <img src="https://www.mynyte.co.uk/live/sneak-preview/img/logo.png" alt="Legal Serve - Process Server in Bedfordshire &amp; Buckinghamshire">
    </div>
    <div style="opacity: 0;" class="page-container slow-trans">
    	<div>
      		<?php include_once("templates/header-template.php"); ?>
		</div>
        
        <div class="header-img trans at-top">
            <div class="header-inner-wrap">
            </div>
            
            <i class="fa fa-phone"></i>
            <h1>Contact Us</h1>
        </div>
    
        <div class="central-container">
        
        <div class="main-container-2 main-container main-container-white product-summary product-summary-narrow">
            <div class="text">
                <div class="product-summary-tile">
                    <i class="fa fa-phone tile-icon tile-icon-features"></i>
                    <h4>Call us</h4>
                    <a href="tel:01234245554">01234 24 55 54</a>
                </div>
                <div class="product-summary-tile">
                    <i class="fa fa-envelope tile-icon tile-icon-features"></i>
                    <h4>Email us</h4>
                    <a href="mailto:business@mynyte.co.uk">business@mynyte.co.uk</a>
                </div>
                <div class="product-summary-tile">
                    <i class="fa fa-facebook tile-icon tile-icon-features"></i>
                    <h4>Like us</h4>
                    <a href="https://www.facebook.com/mynyte">Facebook.com/mynyte</a>
                </div>
                <div class="product-summary-tile">
                    <i class="fa fa-google tile-icon tile-icon-features"></i>
                    <h4>Get MyNyte</h4>
                    <a href="">On Google Play</a>
                </div>
                <div class="product-summary-tile product-summary-tile-last">
                    <i class="fa fa-apple tile-icon tile-icon-features"></i>
                    <h4>MyNyte on Apple</h4>
                    <a href="">On the App Store</a>
                </div>
            </div>
        </div>
    
        <div class="main-container-2 main-container main-container-dark-grey contact-summary">
            <div class="text">
                <h2 class="lower">Get in touch with us</h2>
                <p>
                    We're on hand, ready to take any of your queries on our Website and Business Promotion services.
                </p>
                <div class="contact-section">
                    <h4>Contact Us Online</h4>
                    
                    <form>
                        <div>
                            <i class="fa fa-user"></i>
                            <input type="text" placeholder="Your Name (required)" name="Name"/>
                            <span class="error-span">
                                <span>Please enter a valid name.</span>
                            </span>
                        </div>
                        <div>
                            <i class="fa fa-envelope-o"></i>
                            <input type="text" placeholder="E-mail Address (required)" name="Email"/>
                            <span class="error-span">
                                <span>Please enter a valid e-mail.</span>
                            </span>
                        </div>
                        <div>
                            <i class="fa fa-phone"></i>
                            <input type="text" placeholder="Phone Number" name="Phone"/>
                            <span class="error-span">
                                <span>Please enter a valid phone number.</span>
                            </span>
                        </div>
                        <div>
                            <i class="fa fa-black-tie"></i>
                            <input type="text" placeholder="Company Name" name="Company"/>
                        </div>
                        <div>
                            <i class="fa fa-comment"></i>
                            <textarea placeholder="Message (required)" name="Message"></textarea>
                            <span class="error-span">
                                <span>Please enter a Message.</span>
                            </span>
                        </div>
                        <button onclick="contactMyDay(this, event);">Contact</button>
                    </form>
                </div>

                <div class="contact-section">
                    <h4>Visit Us</h4>
                    <div id="map-canvas" style="height:478px;width:100%;margin-bottom: 17px;"></div>
                    <script>function initialise(){var myLatlng=new google.maps.LatLng(52.369238,-1.285598);var mapOptions={zoom:10,minZoom:6,maxZoom:15,zoomControl:true,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL},center:myLatlng,mapTypeId:google.maps.MapTypeId.ROADMAP,scrollwheel:false,panControl:false,mapTypeControl:false,scaleControl:false,streetViewControl:false,overviewMapControl:false,rotateControl:false}
var map=new google.maps.Map(document.getElementById('map-canvas'),mapOptions);var myOptions={content:document.getElementById("bubble"),disableAutoPan:false,alignBottom:true,scrollwheel:false,maxWidth:0,pixelOffset:new google.maps.Size(-82,-15),zIndex:null,infoBoxClearance:new google.maps.Size(1,1),isHidden:false,pane:"floatPane",enableEventPropagation:false};var image=new google.maps.MarkerImage("../live/sneak-preview/img/logo.png",null,null,null,new google.maps.Size(1,1));var marker=new google.maps.Marker({position:myLatlng,icon:image,map:map,});}google.maps.event.addDomListener(window,'load',initialise);</script>
                    
                </div>
                
                <div class="contact-section business-promotion-section-last">
                    <h4>Our Address</h4>
                    <p><i class="fa fa-building"></i>MyNyte Ltd.<br />Bedford i-Kan<br/>38 Mill Street<br/>Bedford</br>MK40 3HD</p>

                    <h4>Other Contact Details</h4>
                    
                    <p><i class="fa fa-phone"></i>Phone: (01234) 24 55 54</p>
                    <p><i class="fa fa-envelope"></i>Email: business@mynyte.co.uk</p>
                </div>
            </div>
        </div>
    
        <div class="footer no-top-marg">
            <?php include_once("templates/footer-template.php"); ?>
        </div>

    </div>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-92441562-1', 'auto');
      ga('send', 'pageview');

    </script>



</div></body></html>

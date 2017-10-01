<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
?>
<div class="mynyte-popup-cover">
  <div class="mynyte-popup">
    <i class="ion-plus-round"></i>
    <div class="mynyte-pop-inner">
      <div class="mn-popup-header">Please enter your Details<span class="mn-popup-close">Cancel</span></div>
      <div class="mn-popup-body">
        <form>
          <input type="text" placeholder="Your Name">
          <input type="text" placeholder="Your Email (optional)">
          <div class="mn-form-option-note">
            <span>Send a transcript of this chat to my e-mail address once finished.</span>
            <input type="checkbox">
          </div>
          <button class="start-chat">Start Chat</button>
        </form>
        <div class="mn-popup-chat-ad">Sign into MyNyte for all kinds of benefits! Blah blah</div>
      </div>
      <div class="mn-popup-footer">
        <span>Keep a record of all your chats &amp; queries</span>
        <img src="https://www.mynyte.co.uk/sneak-preview/img/logo.png" />
      </div>
    </div>
  </div>
</div>
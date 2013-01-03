
# Message

Experimental Mobile/Visualization/Cloud Monitoring App

On and off during the holidays, I worked on a sample Mobile app that
queries Cloud Monitoring Metric data and then graphs it using D3.  The
code compiles down to iOS and Android, but also runs as a website with
the help of a cross-domain proxy.  It needs to be refactored, doc'd,
and visually prettied up, but it works well.

It'll be open sourced as soon as I get the right approvals, but for
now you can download the source here:

* http://xmobile.davidwang.com/xmobile/xmobile.tar.bz

See below for Screenshots and instructions.

Thanks!

-dave

# Screenshots

<img src="doc/screenshots/20121230_ios/01_home.png" width="25%">
<img src="doc/screenshots/20121230_ios/02_d3.png" width="25%">
<img src="doc/screenshots/20121230_ios/03_cm_login.png" width="25%">

<img src="doc/screenshots/20121230_ios/04_cm_metrics_selection.png" width="25%">
<img src="doc/screenshots/20121230_ios/05_cm_metrics_graphing.png" width="25%">
<img src="doc/screenshots/20121230_ios/06_about.png" width="25%">


# Installing Xmobile on an Android Device

You can install it by opening a browser on your device and navigating here:

* http://xmobile.davidwang.com/xmobile/xmobile.apk

# Installing Xmobile on an iOS Device

I think it works because the iOS app runs well within the Xcode iOS Simulator (see Screenshots).

* I don't own an iOS device, and I haven't paid Apple for the right kind of developer access to create a private app store.

# Running Xmobile from your Desktop Web Browser

Navigate here:

* https://xmobile.davidwang.com:8443/

# Serving Xmobile as a Web App on Linux

The software is completely client side, but a server is needed to initially serve the pages and provide a cross-domain reverse proxy.

* Create a 512mb Ubuntu 12.04 server on Rackspace.
  http://www.rackspace.com
* Login and install some packages
  sudo apt-get install git emacs23-nox nmap unzip ant
* Install node.js
  <pre><code>sudo apt-get install g++ curl libssl-dev apache2-utils git-core make
  wget http://nodejs.org/dist/v0.8.14/node-v0.8.14.tar.gz
  tar xzvf node-v0.8.14.tar.gz
  cd node-v0.8.14
  ./configure
  make
  sudo make install
  npm install js-yaml fs express async
  sudo npm -g install cordova
  </code></pre>
* Clone the Xmobile repository
  <pre><code>git clone ssh://dave@s.davidwang.com:2222/var/git/xmobile.git
  cd xmobile
  cd backend
  npm install
  </code></pre>
* Install the Android SDK
  <pre><code>mkdir ~/.devlib
  cd ~/.devlib
  wget http://dl.google.com/android/adt/adt-bundle-linux-x86_64.zip
  unzip adt-bundle-linux-x86_64.zip
  </code></pre>
* Edit the ~/.bash_profile
  <pre><code>emacs ~/.bash_profile
  //// File Contents
  export PATH=${PATH}:~/.devlib/adt-bundle-linux-x86_64/sdk/platform-tools:~/.devlib/adt-bundle-linux-x86_64/sdk/tools
  export PATH=${PATH}:/usr/local/share/npm/bin
  //// EOF
  source ~/.bash_profile
  </code></pre>
* Run the app for android: (default: 8000)
  <pre><code>cd xmobile
  sudo cordova platform add android
  cordova serve android
  </code></pre>
* Run the cross-domain reverse proxy server, which is necessary only for the website (default: 8443)
  <pre><code>cd xmobile/backend
  node server.js conf/config.yaml
  </code></pre>
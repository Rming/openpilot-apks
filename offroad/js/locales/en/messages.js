/* eslint-disable */module.exports={languageData:{"plurals":function(n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}},messages:{"<  Account Settings":"<  Account Settings","<  Developer Settings":"<  Developer Settings","<  Device Settings":"<  Device Settings","<  Network Settings":"<  Network Settings","<  Pair EON":"<  Pair EON","<  Settings":"<  Settings","A SIM card was entered, however your cellular network has not yet been discovered.":"A SIM card was entered, however your cellular network has not yet been discovered.","A driver assistance system is not a self driving car. This means openpilot is designed to work with you, not without you. Your attention is required to drive.":"A driver assistance system is not a self driving car. This means openpilot is designed to work with you, not without you. Your attention is required to drive.","A vision algorithm leverages EON\u2019s road-facing camera to determine the path to drive.":"A vision algorithm leverages EON\u2019s road-facing camera to determine the path to drive.","Account":"Account","Add SIM Card":"Add SIM Card","Allow devices to connect to your EON using Secure Shell (SSH).":"Allow devices to connect to your EON using Secure Shell (SSH).","Are you sure you want to reboot?":"Are you sure you want to reboot?","Are you sure you want to shutdown?":"Are you sure you want to shutdown?","Are you sure you want to uninstall?":"Are you sure you want to uninstall?","Authorized SSH Keys":"Authorized SSH Keys","Before any signals are sent to control your car, sensors are fused to construct a scene of the road.":"Before any signals are sent to control your car, sensors are fused to construct a scene of the road.","Before we get on the road, let's cover some details and connect to the internet.":"Before we get on the road, let's cover some details and connect to the internet.","Begin Training":"Begin Training","Camera Calibration":"Camera Calibration","Camera from EON":"Camera from EON","Cancel":"Cancel","Comma.ai, Inc. Terms & Conditions":"Comma.ai, Inc. Terms & Conditions","Complete Setup":"Complete Setup","Congratulations! You have completed openpilot training.":"Congratulations! You have completed openpilot training.","Connect":"Connect","Connected":"Connected","Connected to {networkName}":function(a){return["Connected to ",a("networkName")]},"Continue":"Continue","Decline":"Decline","Destination:":"Destination:","Developer":"Developer","Device":"Device","Device Paired":"Device Paired","Disengage openpilot":"Disengage openpilot","Display speed in km/h instead of mp/h and temperature in \xB0C instead of \xB0F.":"Display speed in km/h instead of mp/h and temperature in \xB0C instead of \xB0F.","Dongle ID":"Dongle ID","Driver Monitoring":"Driver Monitoring","Driver Monitoring detects driver awareness with 3D facial reconstruction and pose estimation. It is used to warn the driver when they appear distracted while openpilot is engaged. This feature is still in beta, so Driver Monitoring is unavailable when the facial tracking is too inaccurate (e.g. at night). The availability is indicated by the face icon at the bottom-left corner of your EON.":"Driver Monitoring detects driver awareness with 3D facial reconstruction and pose estimation. It is used to warn the driver when they appear distracted while openpilot is engaged. This feature is still in beta, so Driver Monitoring is unavailable when the facial tracking is too inaccurate (e.g. at night). The availability is indicated by the face icon at the bottom-left corner of your EON.","EON Paired":"EON Paired","Edit":"Edit","Enable Driver Monitoring":"Enable Driver Monitoring","Enable Forward Collision Warning":"Enable Forward Collision Warning","Enable SSH":"Enable SSH","Enable Upload Over Cellular":"Enable Upload Over Cellular","Engage openpilot":"Engage openpilot","Finish Training":"Finish Training","Free Storage":"Free Storage","Git Branch":"Git Branch","Git Revision":"Git Revision","GitHub Username":"GitHub Username","I agree to the terms":"I agree to the terms","I will be ready to take over at any time!":"I will be ready to take over at any time!","I will be ready to take over at any time.":"I will be ready to take over at any time.","I will keep my eyes on the road.":"I will keep my eyes on the road.","Insert a SIM card with data. Need one? Get a comma SIM at shop.comma.ai":"Insert a SIM card with data. Need one? Get a comma SIM at shop.comma.ai","Later":"Later","More Options":"More Options","Network":"Network","Network connection required for pairing":"Network connection required for pairing","New Destination":"New Destination","New Drive":"New Drive","No":"No","No SIM card detected in EON":"No SIM card detected in EON","Now that you\u2019re all set up, it\u2019s important to understand the functionality and limitations of openpilot as alpha software before testing.":"Now that you\u2019re all set up, it\u2019s important to understand the functionality and limitations of openpilot as alpha software before testing.","Open Date and Time Settings":"Open Date and Time Settings","Open Tethering Settings":"Open Tethering Settings","Open WiFi Settings":"Open WiFi Settings","PAIR EON":"PAIR EON","Pair EON":"Pair EON","Paired":"Paired","Password":"Password","Please keep in mind that system behavior may change.{0}{1}":function(a){return["Please keep in mind that system behavior may change.",a("0"),a("1")]},"Power Off":"Power Off","Press cruise to engage and a pedal to disengage.":"Press cruise to engage and a pedal to disengage.","Privacy policy available at https://community.comma.ai/privacy.html":"Privacy policy available at https://community.comma.ai/privacy.html","Radar from your car":"Radar from your car","Read to Continue":"Read to Continue","Reboot":"Reboot","Reboot Now":"Reboot Now","Reboot and Update":"Reboot and Update","Reboot to finalize removal of GitHub SSH keys.":"Reboot to finalize removal of GitHub SSH keys.","Reboot to make SSH keys from {githubUsername} available.":function(a){return["Reboot to make SSH keys from ",a("githubUsername")," available."]},"Record and Upload Driver Camera":"Record and Upload Driver Camera","Remove all":"Remove all","Reset":"Reset","Resetting calibration requires a reboot.":"Resetting calibration requires a reboot.","Restart":"Restart","Review Terms":"Review Terms","Review Training Guide":"Review Training Guide","SIM card detected in EON":"SIM card detected in EON","Save":"Save","Save failed. Ensure that your username is correct and you are connected to the internet.":"Save failed. Ensure that your username is correct and you are connected to the internet.","Scan with {0}comma connect {1}on iOS or Android":function(a){return["Scan with ",a("0"),"comma connect ",a("1"),"on iOS or Android"]},"Searching for cellular networks...":"Searching for cellular networks...","Select WiFi":"Select WiFi","Select face to continue":"Select face to continue","Select lead car indicator":"Select lead car indicator","Select path to continue":"Select path to continue","Serial Number":"Serial Number","Set up your EON":"Set up your EON","Settings":"Settings","Shutdown":"Shutdown","Skip":"Skip","Skip for now":"Skip for now","Tap \"SET\" to engage":"Tap \"SET\" to engage","Tap a pedal to disengage":"Tap a pedal to disengage","The calibration algorithm is always active on the road facing camera. Resetting calibration is only advised when EON reports an invalid calibration alert or when EON is remounted in a different position.":"The calibration algorithm is always active on the road facing camera. Resetting calibration is only advised when EON reports an invalid calibration alert or when EON is remounted in a different position.","The indicator is drawn either red or yellow to illustrate relative speed to the lead car.":"The indicator is drawn either red or yellow to illustrate relative speed to the lead car.","The lane lines are drawn with varying widths to reflect the confidence in finding your lane.":"The lane lines are drawn with varying widths to reflect the confidence in finding your lane.","The stock radar in your car helps openpilot measure the lead car distance for longitudinal control.":"The stock radar in your car helps openpilot measure the lead car distance for longitudinal control.","This guide can be replayed at any time from the EON settings. To learn more about openpilot, read the wiki and join the community at discord.comma.ai":"This guide can be replayed at any time from the EON settings. To learn more about openpilot, read the wiki and join the community at discord.comma.ai","Uninstall":"Uninstall","Uninstall {software}":function(a){return["Uninstall ",a("software")]},"Unpaired":"Unpaired","Update Available":"Update Available","Upload Speed":"Upload Speed","Upload data from the driver facing camera and help improve the Driver Monitoring algorithm.":"Upload data from the driver facing camera and help improve the Driver Monitoring algorithm.","Upload driving data over cellular connection if a sim card is used and no wifi network is available. If you have a limited data plan, you might incur in surcharges.":"Upload driving data over cellular connection if a sim card is used and no wifi network is available. If you have a limited data plan, you might incur in surcharges.","Use Metric System":"Use Metric System","Use visual and acoustic warnings when risk of forward collision is detected.":"Use visual and acoustic warnings when risk of forward collision is detected.","Version":"Version","WARNING: This grants SSH access to all public keys in your GitHub settings. Never enter a GitHub username other than your own. A comma employee will never ask you to add their GitHub.":"WARNING: This grants SSH access to all public keys in your GitHub settings. Never enter a GitHub username other than your own. A comma employee will never ask you to add their GitHub.","Waiting for SIM...":"Waiting for SIM...","Waiting for network...":"Waiting for network...","Welcome to EON":"Welcome to EON","Welcome to openpilot alpha":"Welcome to openpilot alpha","When openpilot is engaged, you must always pay attention! openpilot monitors awareness with 3D facial reconstruction and pose. Distracted drivers are alerted, then disengaged from openpilot until corrected.":"When openpilot is engaged, you must always pay attention! openpilot monitors awareness with 3D facial reconstruction and pose. Distracted drivers are alerted, then disengaged from openpilot until corrected.","When you are ready to engage openpilot at a comfortable speed, locate the cruise controls on your steering wheel and press \"SET\" to begin.":"When you are ready to engage openpilot at a comfortable speed, locate the cruise controls on your steering wheel and press \"SET\" to begin.","While openpilot is engaged, you may keep your hands on the wheel to override lateral controls. Longitudinal controls will be managed by openpilot until the gas or brake pedal is pressed to disengage.":"While openpilot is engaged, you may keep your hands on the wheel to override lateral controls. Longitudinal controls will be managed by openpilot until the gas or brake pedal is pressed to disengage.","Yes":"Yes","You're all set to get EON on the road with full cellular connection. Complete set up to continue.":"You're all set to get EON on the road with full cellular connection. Complete set up to continue.","openpilot controls":"openpilot controls","openpilot is an advanced driver assistance system.":"openpilot is an advanced driver assistance system.","openpilot sensors":"openpilot sensors","openpilot uses multiple sensors to see the road ahead.":"openpilot uses multiple sensors to see the road ahead.","openpilot will start driving when cruise control is set.":"openpilot will start driving when cruise control is set.","{0} Free":function(a){return[a("0")," Free"]},"{freeSpaceText} Free":function(a){return[a("freeSpaceText")," Free"]}}};
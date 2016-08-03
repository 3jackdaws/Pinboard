# [Pinboard](https://pinboard.isogen.net)
Pinboard is an web-based bulletin/cork board that allows users to post and organize sticky notes collaboratively on shared access pages.  These pages are called boards and anyone can create one.  Information is divided between up to eight separate modules that serve different purposes.  
![Home Page](http://isogen.net/content/pinboard-homepage.jpg)

##Supported Modules

* Sticky Notes

##Sticky Notes
Allows users to post up to 16 sticky notes per module.  Sticky note text and location on the board is tracked LIVE and updates within half a second on any other browser. Other users viewing the same board see your changes in real time.
![Sticky Note Module](http://isogen.net/content/board-demo.jpg)


##Technologies
Pinboard uses several neat tricks to work the way it does. 
###SlipStream
SlipStream is a custom javascript and PHP library that mimics server push.  WebSockets ~~are not mature enough~~  require too many dependencies and it was easier to write plain javascript that is cross browser compatible.

Each module on a page must "register" with SlipStream so that the class can recieve server pushes on one connection.  This is to avoid Internet Explorer's measly two connections per domain limit.  Connections are accepted server-side by a PHP script that "holds on to" the connection until it determines that it needs to notify the client.  Upon return, the client parses the data, splits the data up to each individual registered module and immediately opens another connection.  

# Pathfinding-Algorithm-Visualization-Tool
Developed a visualization tool with various features in order to find the shortest distance between two nodes on a map.
This tool has the ability to switch between different algorithms, create/destroy walls and create check points for the various algorithms to explore.
Created using JavaScript in order to have to largest outreach and easy interactions on the internet.

Tutorial:
In order to create a start and end point simple left click on any node to make it a starting point and right click anywhere to create an ending point.
At this point one can simply click "Start" in order to find the shortest path between the two nodes.

The next button in the list is "Algorithm", this drop down menu will allow one to select which pathfinding algorithm they wish to use. By default this is set to be the A-Star algorithm.‍ 

By clicking the "Wall Mode" button one can enter wall creation mode, this will allow you to click and drag in order to create walls across the map that the algorithm will avoid.
Click and dragging on previously created walls will allow one to delete walls that they have created. In order to exit wall mode, simply click on the "Wall Mode" button again.

A unique feature to this tool is the ability to create check points across the map. To add check points, click on the "Add Check Points" button to enter the add check points mode. 
In this mode, one can click on nodes to make the checkpoints. Making a node a check point will force the algorithm to visit this node before proceeding to the end point,
one can make as many check points as they wish.

The final feature of this tool, is the ability to turn of visual nodes. Normally there are animations to show which nodes the algorithm is considering, 
however at times this can be a lengthy process to wait for animations. Therefore one can simply click on the "Disable Visual Nodes" buttons to turn off animations
and drastically speed up the algorithm.

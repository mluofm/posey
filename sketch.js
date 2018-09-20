let eye;
let video;
let poseNet;
let poses = [];
let skeletons = [];

function preload() {
  eye = loadImage("images/eye.jpg");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  // Resize the eye image
  eye.resize(30, 16);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();

  // Show the frameRate 
  fill(255);
  textSize(15);
  noStroke();
  text(`frameRate: ${floor(frameRate())}`, 15, 30);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        switch (keypoint.part) {
          case "leftEye":
          case "rightEye":
            image(eye, keypoint.position.x - eye.width / 2, keypoint.position.y - eye.height / 2, eye.width, eye.height);
            break;
          default:
            fill("#92DCE5");
            noStroke();
            ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
      }
    }
  }
}

function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke("#92DCE5");
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

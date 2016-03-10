/*
The MIT License (MIT)
Copyright (c) <2016> <Leonard Schütz>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Init all Image Viewers
var ImageViewerInit = function(event) {

    // Initialize the global ImageViewers object
    window.ImageViewers = {
        viewers: [],
        currentlyOpen: undefined
    };

    // Get all image viewers
    var allIV = document.getElementsByTagName('image-viewer');

    // Initialize and append all image viewers
    if (allIV.length != 0) {
        for (var i=0; i < allIV.length; i++) {
            window.ImageViewers.viewers.push(new ImageViewer(allIV[i].getAttribute('src'), allIV[i]));
        }
    }
}
window.onload = ImageViewerInit;

// Image Viewer Prototype
var ImageViewer = function(src, element) {

    // Member variables
    this.src = src;
    this.image = undefined;
    this.open = false;
    this.element = element;
    this.description = undefined;

    // Extract the text out of the p tag inside the image-viewer
    if (this.element) {
        if (element.children.length > 0) {
            this.description = this.element.children[0].innerHTML;
            this.element.removeChild(this.element.children[0]);
        }
    } else {
        throw "#1: No element specified";
    }

    // Check if a src was set
    if (!this.src) {
        throw "#2: No src specified";
    }

    // Create a new image object
    this.createImage = function(src) {
        var Image = document.createElement('img');
        Image.src = src;
        return Image;
    }

    // Inject the image into the element
    this.image = this.createImage(this.src);
    this.element.appendChild(this.image);

    this.close = function(container) {
        container.parentNode.removeChild(container);
        this.element.style.opacity = "1";
        this.open = false;
    };

    // Toggle the image expansion
    this.show = function(callback) {

        // Hide the image on the page
        this.element.style.opacity = "0";

        // Create a div
        var container = document.createElement('div');
        container.className = "image-viewer-overlay";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.backgroundColor = "rgba(0,0,0,0.8)";
        container.style.webkitBackdropFilter = "blur(2px)";

        // Append the image
        var image = this.createImage(this.src);
        image.style.top = "50%";
        image.style.left = "50%";
        image.style.position = "absolute";
        image.style.transform = "translate(-50%, -50%)";
        image.style.maxWidth = "100vw";
        image.style.borderRadius = "2px";
        container.appendChild(image);

        // Append the paragraph
        var paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(this.description));
        paragraph.style.top = "calc(50% + " + image.naturalHeight/2 + "px)";
        paragraph.style.left = "50%";
        paragraph.style.position = "absolute";
        paragraph.style.transform = "translate(-50%, -50%)";
        paragraph.style.color = "white";
        container.appendChild(paragraph);

        // Close the popover when your press outside of the image
        container.onclick = function(event) {
            if (event.target.tagName == 'DIV') {
                this.close(container);
            }
        }.bind(this);

        // Inject into the document
        document.body.appendChild(container);

        // Toggle the open variable
        this.open = true;
    }

    // Append the onclick event handler
    this.element.onclick = function(event) {
        event.preventDefault();

        // Only open when the image is closed
        if (!this.open) {
            // Show the image
            this.show();
        } else {
            this.close();
        }
    }.bind(this);
}

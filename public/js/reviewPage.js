// reviewPage.js

// Displays the create review button if signed in, otherwise it is not displayed
fetch('/user')
    .then(response => {
        if (!response.ok) {
            document.getElementById('createButton').style.display = 'none';
        }
        return response.json();
    })
    // Takes user to the create review page and passes course name in url
    .then(user => {
        
        if (user.suspended) {
            // If the user is suspended, hide the create review button
            document.getElementById('createButton').style.display = 'none';
        } else {
            const createReview = document.getElementById('createReview');
            const urlParams = new URLSearchParams(window.location.search);
            const cName = urlParams.get('cname');
            
            createReview.href = `/createReview?cname=${cName}`;
        }
    })
    .catch(error => {
        console.error('Error fetching user:', error);
    });

// Display the correct course name on the review page
const courseNameHeader = document.getElementById('courseNameHeader');
const urlParams = new URLSearchParams(window.location.search);
const courseName = urlParams.get('cname');

fetch(`/reviews/${courseName}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user reviews');
        }
        return response.json();
    })
    .then(reviews => {
        const reviewList = document.getElementById('review-list'); 

        reviewList.innerHTML = '';

        if (reviews.length === 0) {
            const noReviews = document.createElement('div');
            noReviews.textContent = 'No reviews have been made for this course.';
            reviewList.appendChild(noReviews);
        } else {
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.innerHTML = `
                <article>
                    <h3 style="text-align: right"><b>${review.rcreated}</b></h3>
                    <h5><b>Review by ${review.uname}</b></h5>
                    <h3 style="text-align: left"><b>Professor of the Course:</b> ${review.prof}</h3>
                    <h3 style="text-align: left"><b>General Description:</b> ${review.content}</h3>
                    <h3 style="text-align: left"><b>Assessment:</b> ${review.grading}</h3> 
                    <h3 style="text-align: left"><b>Additional Notes:</b> ${review.anotes}</h3> 
                    <h3 style="text-align: left"><b>Rating:</b> ${review.crating}/5</h3>
                    <button type="button" id="reportButton" data-review-id= "${review.review_id}">Report review</button> 
                    <br><br>
                </article>
                <br>
                `;
                reviewList.appendChild(reviewElement);
            });
        }
    })
    .catch(error => console.error('Error fetching user reviews:', error));

// Display the correct course name on page
if (courseName) {
    courseNameHeader.innerText = `${courseName.toUpperCase()} Reviews`;
}

document.addEventListener('DOMContentLoaded', () => {
    const reviewList = document.getElementById('review-list');

    reviewList.addEventListener('click', (event) => {
        if (event.target.id === 'reportButton') {
            const reviewId =  event.target.getAttribute('data-review-id');
            reportReview(reviewId);
        }
    });
});

function reportReview(reviewId) {
    fetch(`/report/${reviewId}`, {
        method: 'POST',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to report review');
        }
        console.log('Review reported successfully');
    })
    .catch(error => {
        console.error('Error reporting review:', error);
    });
}
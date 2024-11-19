<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and retrieve form data
    $firstname = htmlspecialchars($_POST['firstname']);
    $lastname = htmlspecialchars($_POST['lastname']);
    $country = htmlspecialchars($_POST['country']);
    $subject = htmlspecialchars($_POST['subject']);

    // CSV file path
    $csvFile = 'contacts.csv';

    // Open CSV file in append mode
    $fileHandle = fopen($csvFile, 'a');

    // Add a header row if the file is empty
    if (filesize($csvFile) == 0) {
        fputcsv($fileHandle, ['First Name', 'Last Name', 'Country', 'Subject']);
    }

    // Save form data as a new row
    fputcsv($fileHandle, [$firstname, $lastname, $country, $subject]);

    // Close the file
    fclose($fileHandle);

    // Redirect or show success message
    echo "<p>Thank you for contacting us! Your message has been saved.</p>";
    echo "<a href='index.html'>Go Back</a>";
} else {
    echo "Invalid submission.";
}
?>
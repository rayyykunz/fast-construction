<?php
// Set headers
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

// Validate data
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill in all required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email address']);
    exit;
}

// Prepare email content
$to = 'raynzpro@gmail.com'; // Replace with FAST's email
$email_subject = "New Contact Form Submission: $subject";
$email_body = "You have received a new message from your website contact form.\n\n" .
              "Here are the details:\n\n" .
              "Name: $name\n\n" .
              "Email: $email\n\n" .
              "Subject: $subject\n\n" .
              "Message:\n$message";

$headers = "From: $email\n";
$headers .= "Reply-To: $email\n";

// Send email
$mail_sent = mail($to, $email_subject, $email_body, $headers);

if ($mail_sent) {
    // Log the contact submission
    $log_entry = date('Y-m-d H:i:s') . " - Name: $name, Email: $email, Subject: $subject\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND);
    
    echo json_encode(['success' => true, 'message' => 'Thank you for your message. We will get back to you soon.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again later.']);
}
?> 

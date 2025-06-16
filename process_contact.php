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

// Validate input
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode([
        'success' => false,
        'error' => 'Please fill in all required fields.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'error' => 'Please enter a valid email address.'
    ]);
    exit;
}

// Email configuration
$to_email = 'raynzpro@gmail.com';
$to_name = 'PT. FAST';
$from_email = 'noreply@yourdomain.com'; // Replace with your domain email
$from_name = 'PT. FAST Contact Form';

// Prepare email content
$email_subject = "Contact Form: $subject";
$email_body = "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Subject: $subject\n\n";
$email_body .= "Message:\n$message";

// Try to send email using PHP's mail function first
if (mail($to_email, $email_subject, $email_body, "From: $from_name <$from_email>\r\nReply-To: $email\r\n")) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);
    exit;
}

// If mail() fails, try using SMTP
try {
    // Include PHPMailer classes
    require 'vendor/autoload.php';
    
    // Create a new PHPMailer instance
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Replace with your SMTP host
    $mail->SMTPAuth = true;
    $mail->Username = 'raynzpro@gmail.com'; // Replace with your email
    $mail->Password = 'TrzaFX1D'; // Replace with your app password
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Recipients
    $mail->setFrom($from_email, $from_name);
    $mail->addAddress($to_email, $to_name);
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(false);
    $mail->Subject = $email_subject;
    $mail->Body = $email_body;
    
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);
} catch (Exception $e) {
    // Log the error
    error_log("Email sending failed: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send message. Please try again later.'
    ]);
}
?>

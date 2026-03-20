<?php

$ch = curl_init('http://127.0.0.1:8000/login');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, ['username' => 'wrong', 'password' => 'wrong', '_token' => 'kTy...', 'test' => 1]);
// We need the ACTUAL CSRF token. Since this script runs outside, it might get 419.
// To bypass 419, let's just use Laravel's internal HTTP testing tools!
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/login', 'POST', [
    'username' => 'wrong',
    'password' => 'wrong'
]);
$request->headers->set('Accept', 'application/json');

$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
if ($response->isRedirect()) {
    echo "Redirect: " . $response->headers->get('Location') . "\n";
}

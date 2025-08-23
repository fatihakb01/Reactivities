using System;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Infrastructure.Email;

/// <summary>
/// A custom implementation of <see cref="IEmailSender{TUser}"/> using the Resend API to send emails.
/// </summary>
/// <param name="resend">The Resend API client for sending emails.</param>
/// <param name="config">The application configuration for retrieving settings.</param>
public class EmailSender(IResend resend, IConfiguration config) : IEmailSender<User>
{
    /// <summary>
    /// Sends a confirmation email to the user with a confirmation link.
    /// </summary>
    /// <param name="user">The user for whom to send the email.</param>
    /// <param name="email">The email address to which the confirmation link should be sent.</param>
    /// <param name="confirmationLink">The confirmation link to be included in the email body.</param>
    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        var subject = "Confirm your email address";
        var body = $@"
            <p>Hi {user.DisplayName}</p>
            <p>Please confirm your email by clicking the link below</p>
            <p><a href='{confirmationLink}'>Click here to verify email</a></p>
            <p>Thanks</p>
        ";

        await SendMailAsync(email, subject, body);
    }

    /// <summary>
    /// Sends an email to the user containing a password reset link.
    /// </summary>
    /// <param name="user">The user for whom to send the password reset email.</param>
    /// <param name="email">The email address to which the password reset link should be sent.</param>
    /// <param name="resetCode">The password reset code from ASP.NET Identity.</param>
    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        var subject = "Reset your password";
        var body = $@"
            <p>Hi {user.DisplayName}</p>
            <p>Please click this link to reset your password</p>
            <p><a href='{config["ClientAppUrl"]}/resetPassword?email={email}&code={resetCode}'>
                Click here to reset your password</a>
            </p>
            <p>If you did not request this, you can ignore this email</p>
        ";

        // System.Console.WriteLine(body); // for testing purposes

        await SendMailAsync(email, subject, body);
    }

    /// <summary>
    /// This method is not implemented. <c>SendPasswordResetCodeAsync</c> is used instead.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <param name="email">The email address.</param>
    /// <param name="resetLink">The password reset link.</param>
    /// <exception cref="NotImplementedException">Thrown because this method is not in use.</exception>
    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Internal method to send an email using the Resend service.
    /// </summary>
    /// <param name="email">The recipient's email address.</param>
    /// <param name="subject">The subject line of the email.</param>
    /// <param name="body">The HTML body of the email.</param>
    private async Task SendMailAsync(string email, string subject, string body)
    {
        var message = new EmailMessage
        {
            From = "whatever@resend.dev",
            Subject = subject,
            HtmlBody = body
        };

        message.To.Add(email);

        await resend.EmailSendAsync(message);
        // await Task.CompletedTask; // for testing purposes
    }
}

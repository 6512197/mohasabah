package com.mohasabah.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Email
@Builder
@Data
// use jakarta  @PasswordsMatch pssword == passwordcofirm or do it in services


public class UserRegisterRequestDto {


    @NotBlank(message = "First name is required")
    @Size(max = 100)
    String firstName ;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    String lastName;
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth ;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255)
    String email;
    @NotBlank  @Email String emailConfirm;
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password;
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String passwordConfirm;


}

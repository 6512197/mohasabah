package com.mohasabah.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserUpdateRequestDto(


    @NotBlank(message = "First name is required")
    @Size(max = 100)
    String firstName ,

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    String lastName,

    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth ,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255)
    String email,

    String avatarSvg ,
    String timezone

) {
}

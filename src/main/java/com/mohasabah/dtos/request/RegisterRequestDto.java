package com.mohasabah.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Email
@Builder
@Data

public class RegisterRequestDto {


    @NotBlank private String firstName ;
    @NotBlank private String lastName;
    @NotBlank private LocalDate birthday;
    @NotBlank
    @Email
    String email;
    @NotBlank  @Email String emailConfirm;
    // todo change html password to 8 charchters instead of 6
    @NotBlank private  @Size  (min = 8 ) String password;
    @NotBlank private  @Size  (min = 8 ) String passwordConfirm;




}

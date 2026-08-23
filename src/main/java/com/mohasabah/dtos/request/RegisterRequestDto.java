package com.mohasabah.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Email
@Builder
@Data

public class RegisterRequestDto {

    @NotBlank
    @Email
    String email;
    @NotBlank private String firstName ;
    @NotBlank private String lastName;
    @NotBlank private  @Size  (min = 8 ) String password;


}

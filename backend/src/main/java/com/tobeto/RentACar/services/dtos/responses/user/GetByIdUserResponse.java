package com.tobeto.RentACar.services.dtos.responses.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tobeto.RentACar.security.entities.Role;
import com.tobeto.RentACar.services.dtos.responses.rental.GetByIdRentalResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetByIdUserResponse {
    private String id;
    private String name;
    private String surname;
    private String email;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;
    private String password;
    private String userPhotoUrl;
    private Role role;
    GetByIdRentalResponse rentalId;

}

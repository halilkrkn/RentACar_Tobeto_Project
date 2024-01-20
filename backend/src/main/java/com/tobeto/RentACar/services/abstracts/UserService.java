package com.tobeto.RentACar.services.abstracts;

import com.tobeto.RentACar.services.dtos.requests.user.*;
import com.tobeto.RentACar.services.dtos.responses.user.GetAllUserResponse;
import com.tobeto.RentACar.services.dtos.responses.user.GetByIdUserResponse;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    void add(AddUserRequest request);
    void update(UpdateUserRequest request);
    DeleteUserRequest delete(int id);

    List<GetAllUserResponse> getAll();

    GetByIdUserResponse getById(int id);
    boolean existsById(int id);

    void register(RegisterUserRequest registerUserRequest);
    String login (LoginUserRequest loginUserRequest);





}

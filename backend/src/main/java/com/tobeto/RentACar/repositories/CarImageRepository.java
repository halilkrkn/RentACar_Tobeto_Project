package com.tobeto.RentACar.repositories;

import com.tobeto.RentACar.entities.concretes.carImage.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarImageRepository extends JpaRepository<CarImage, Integer> {
    boolean existsById(int id);
}

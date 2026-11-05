package com.pp2.crazySports.model.admin;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @NotBlank(message = "DEBE PONER EL NOMBRE DE USUARIO")
    private String usuario;
    @NotBlank(message = "DEBE PONER LA CLAVE")
    private String password;
    private String email; //por si tiene un mail, seria raro pero por las dudas
}

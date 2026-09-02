package com.pp2.crazySports.model.club;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="clubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "El nombre de la institucion no puede estar vacio")
    @Column(nullable = false)
    private String nombreInstitucion;
    @NotBlank(message = "La direccion no puede estar vacia")
    @Column(nullable = false)
    private String direccion;

    //Formato: "latitud,longitud" -> "-32.1712,-64.3450" (HU-07 MAPA INTERACTIVO)
    private String coordenadas;
    private String sitioWebUrl;

    @ElementCollection
    @CollectionTable(name = "club_fotos", joinColumns = @JoinColumn(name = "club_id"))
    @Column(name = "foto_url")
    private List<String> fotos;


    private String email;
    private String telefono;
    private String disciplinas;        // "Fútbol, Básquet, Natación"
    private String descripcion;        // Texto libre sobre el club
    private String horarios;           // "Lunes a Viernes 8:00 - 22:00"
    private Boolean deporteAdaptado = false;   // Para el filtro de inclusión (RF-05)

    public void actualizarInformacion(String direccion, String coordenadas, String sitioWebUrl, List<String> fotos) {
        this.direccion = direccion;
        this.coordenadas = coordenadas;
        this.sitioWebUrl = sitioWebUrl;
        this.fotos = fotos;
    }

}

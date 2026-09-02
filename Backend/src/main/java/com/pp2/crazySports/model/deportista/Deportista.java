package com.pp2.crazySports.model.deportista;

import com.pp2.crazySports.model.club.Club;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "deportistas")
@Getter @Setter @NoArgsConstructor
public class Deportista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El deporte no puede estar vacio")
    @Column(nullable = false)
    private String deporte;

    @Min(value=1, message = "La edad debe ser mayor a 0")
    private Integer edad;

    @Column(columnDefinition = "TEXT")
    private String historia;  //TRAYECTORIA, DE DONDE VIENE

    @Column(columnDefinition = "TEXT")
    private String logros; //CAMPEONATOS, RECONOCIMIENTOS, RECORDS

    @Column(nullable = true)
    private String sitioWebUrl;
    private String email;
    private String telefono;
    private Boolean deporteAdaptado = false;


    @ElementCollection
    @CollectionTable(name = "deportista_fotos", joinColumns = @JoinColumn(name = "deportista_id"))
    @Column(name = "foto_url")
    private List<String> fotos;

    //Opcional - Puede estar asociado a un club pero no es obligatorio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = true)
    private Club club;
}

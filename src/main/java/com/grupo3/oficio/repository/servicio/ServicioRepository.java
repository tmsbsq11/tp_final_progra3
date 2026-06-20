package com.grupo3.oficio.repository.servicio;

import com.grupo3.oficio.model.trabajos.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio,Integer> {
    @Query(value = """
    SELECT s.* FROM servicios s
    JOIN trabajos t ON s.id = t.id
    JOIN trabajadores tr ON t.id_trabajador = tr.id
    WHERE t.is_active = true
      AND t.is_approved = true
      AND (:idCategoria IS NULL OR t.id_categoria = :idCategoria)
      AND (:busqueda IS NULL OR LOWER(t.titulo) LIKE LOWER(CONCAT('%', :busqueda, '%'))
                              OR LOWER(t.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%')))
      AND (
        :lat IS NULL OR :lng IS NULL OR :radioKm IS NULL OR
        (6371 * ACOS(
            LEAST(1, GREATEST(-1,
                COS(RADIANS(:lat)) * COS(RADIANS(tr.latitud)) *
                COS(RADIANS(tr.longitud) - RADIANS(:lng)) +
                SIN(RADIANS(:lat)) * SIN(RADIANS(tr.latitud))
            ))
        )) <= :radioKm
      )
    """, nativeQuery = true)
    List<Servicio> buscarConFiltros(
            @Param("idCategoria") Integer idCategoria,
            @Param("busqueda") String busqueda,
            @Param("lat") Double lat,
            @Param("lng") Double lng,
            @Param("radioKm") Double radioKm
    );
}

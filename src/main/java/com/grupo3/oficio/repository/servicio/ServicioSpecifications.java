package com.grupo3.oficio.repository.servicio;


import com.grupo3.oficio.model.trabajos.Servicio;
import org.springframework.data.jpa.domain.Specification;

public class ServicioSpecifications {
    public static Specification<Servicio> activosYAprobados() {
        return (root, query, cb) -> cb.and(
                cb.isTrue(root.get("isActive")),
                cb.isTrue(root.get("isApproved"))
        );
    }

    public static Specification<Servicio> conCategoria(Integer idCategoria) {
        if (idCategoria == null) {
            return null;
        }
        return (root, query, cb) ->
                cb.equal(root.get("categoria").get("id"), idCategoria);
    }

    public static Specification<Servicio> conBusqueda(String busqueda) {
        if (busqueda == null || busqueda.isBlank()) {
            return null;
        }
        String like = "%" + busqueda.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("titulo")), like),
                cb.like(cb.lower(root.get("descripcion")), like)
        );
    }
}

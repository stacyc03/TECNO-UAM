-- Equipos de demostración para TecnoUAM

INSERT INTO equipos (codigo, nombre, tipo, estado)
SELECT 'DEMO-UAM-001', 'Laptop HP ProBook', 'PORTATIL', 'DISPONIBLE'
    WHERE NOT EXISTS (
    SELECT 1 FROM equipos WHERE codigo = 'DEMO-UAM-001'
);

INSERT INTO equipos (codigo, nombre, tipo, estado)
SELECT 'DEMO-UAM-002', 'Proyector Epson PowerLite', 'PROYECTOR', 'DISPONIBLE'
    WHERE NOT EXISTS (
    SELECT 1 FROM equipos WHERE codigo = 'DEMO-UAM-002'
);

INSERT INTO equipos (codigo, nombre, tipo, estado)
SELECT 'DEMO-UAM-003', 'Tableta Samsung Galaxy Tab', 'TABLETA', 'DISPONIBLE'
    WHERE NOT EXISTS (
    SELECT 1 FROM equipos WHERE codigo = 'DEMO-UAM-003'
);
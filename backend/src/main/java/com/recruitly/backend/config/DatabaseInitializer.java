package com.recruitly.backend.config;

// db imports
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
// springframework imports
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    private final DataSource dataSource; // instance of DataSource to manage database connections

    // Constructor to inject the DataSource dependency (DI)
    public DatabaseInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String schema = new ClassPathResource("schema.sql").getContentAsString(
            StandardCharsets.UTF_8
        );
        try (
            Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement()
        ) {
            stmt.executeUpdate(schema);
        }
    }
}

package com.recruitly.backend.config;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    private final DataSource dataSource;

    public DatabaseInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // schema.sql has multiple CREATE TABLE statements (split by ;).
        // Trigger files have END; inside them — execute whole file as-is.
        String[] scripts = {
            "schema.sql",
            "triggers/verify_recruiter.sql",
            "triggers/verify_applicant.sql",
        };

        try (
            Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement()
        ) {
            for (String script : scripts) {
                String sql = new ClassPathResource(script)
                    .getContentAsString(StandardCharsets.UTF_8)
                    .replaceAll("(?m)^\\s*--.*$", "")
                    .trim();
                if (sql.isEmpty()) {
                    continue;
                }
                if (script.equals("schema.sql")) {
                    for (String statement : sql.split(";")) {
                        String trimmed = statement.trim();
                        if (!trimmed.isEmpty()) {
                            stmt.executeUpdate(trimmed);
                        }
                    }
                } else {
                    stmt.executeUpdate(sql);
                }
            }
        }
    }
}

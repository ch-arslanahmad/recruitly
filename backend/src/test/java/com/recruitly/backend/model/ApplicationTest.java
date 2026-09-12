package com.recruitly.backend.model;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ApplicationTest {

    @Test
    void allowTransition_shouldReturnFalse_whenAppliedToHired() {
        Application app = new Application();
        app.setStatus(Application.Status.APPLIED);

        assertFalse(app.allowTransition(Application.Status.HIRED));
    }

    @Test
    void allowTransition_shouldReturnTrue_whenAppliedToRejected() {
        Application app = new Application();
        app.setStatus(Application.Status.APPLIED);

        assertTrue(app.allowTransition(Application.Status.REJECTED));
    }

    @Test
    void allowTransition_shouldReturnTrue_whenAppliedToShortlisted() {
        Application app = new Application();
        app.setStatus(Application.Status.APPLIED);

        assertTrue(app.allowTransition(Application.Status.SHORTLISTED));
    }

    @Test
    void allowTransition_shouldReturnFalse_whenShortlistedToApplied() {
        Application app = new Application();
        app.setStatus(Application.Status.SHORTLISTED);

        assertFalse(app.allowTransition(Application.Status.APPLIED));
    }

    @Test
    void allowTransition_shouldReturnFalse_whenRejectedToAnything() {
        Application app = new Application();
        app.setStatus(Application.Status.REJECTED);
        assertFalse(app.allowTransition(Application.Status.APPLIED));
    }

    @Test
    void allowTransition_shouldReturnFalse_whenHiredToAnything() {
        Application app = new Application();
        app.setStatus(Application.Status.HIRED);
        assertFalse(app.allowTransition(Application.Status.APPLIED));
    }
}

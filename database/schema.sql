CREATE TABLE IF NOT EXISTS users
(
    id integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    full_name text NOT NULL,
	pid text NOT NULL UNIQUE,
    password text NOT NULL,
    email text NOT NULL UNIQUE,
    role text NOT NULL DEFAULT 'zamestnanec',
    company_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS companies
(
    id integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_name text NOT NULL,
    address text,
    ico text NOT NULL UNIQUE,
    created_at timestamp without time zone DEFAULT now(),
    manager_id integer
)

ALTER TABLE companies
ADD CONSTRAINT companies_manager_id_fkey
FOREIGN KEY (manager_id)
REFERENCES users(id)
ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS reports
(
    id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    company_id integer NOT NULL,
    reported_by integer NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    severity text,
    status text DEFAULT 'open',
    occurred_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    assigned_to integer,
    resolution_note text,
    CONSTRAINT accident_reports_company_id_fkey FOREIGN KEY (company_id)
        REFERENCES companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT accident_reports_reported_by_fkey FOREIGN KEY (reported_by)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT reports_assigned_to_fkey FOREIGN KEY (assigned_to)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)

CREATE TABLE IF NOT EXISTS report_images
(
    id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    report_id integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT report_images_report_id_fkey FOREIGN KEY (report_id)
        REFERENCES reports (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS tests
(
    id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    description text,
    target_group text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS questions
(
    id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    test_id integer NOT NULL,
    question_text text NOT NULL,
    CONSTRAINT fk_test FOREIGN KEY (test_id)
        REFERENCES tests (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS assigned_tests
(
    id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    test_id integer NOT NULL,
    employee_id integer NOT NULL,
    assigned_by integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deadline timestamp without time zone,
    submitted_at timestamp without time zone,
    score integer,
    max_score integer,
    status text NOT NULL DEFAULT 'assigned',
    CONSTRAINT fk_employee FOREIGN KEY (employee_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (assigned_by)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_test FOREIGN KEY (test_id)
        REFERENCES tests (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS answers
(
    id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
    question_id integer NOT NULL,
    answer_text text NOT NULL,
    is_correct boolean NOT NULL DEFAULT false,
    CONSTRAINT fk_question FOREIGN KEY (question_id)
        REFERENCES questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

CREATE TABLE resources (
  id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  title     text NOT NULL,
  description text,
  url       text NOT NULL,
  type      text NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

INSERT INTO users (full_name, pid, password, email, role, company_id)
VALUES ('Admin', 'A000000', '$2b$10$Cr0vsmJ3UwM2pO9wEEFF7.TzMTgQ.HGGbZHyrP.e2TAO2T8Wn844K', 'admin@bozp.sk', 'admin', NULL)
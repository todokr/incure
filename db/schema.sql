-- dialect: postgresql

create table tenants
(
    id   text primary key,
    name text not null
);

create table users
(
    id          text primary key,
    family_name text not null,
    given_name  text not null,
    status      text not null,
    tenant_id   text not null references tenants (id)
);

create index users__ti_s on users (tenant_id, status);

create table user_emails
(
    id        text primary key,
    user_id   text    not null references users (id),
    email     text    not null,
    verified  boolean not null default false,
    tenant_id text    not null references tenants (id)
);

-- unique(email, tenant_id) はpsqldefではsyntax error
alter table user_emails
    add constraint user_emails__unique_email unique (email, tenant_id);

create table user_hashed_passwords
(
		id             text primary key,
		user_id        text    not null references users (id),
		hashed_password text    not null,
		tenant_id      text    not null references tenants (id)
);

create index user_emails__ui on user_emails (user_id);

create table incident_statuses
(
    id          text primary key,
    name        text not null,
    status_type text not null,
    color       text not null,
    tenant_id   text not null references tenants (id),
    is_active   boolean not null default true
);

create table incident_roles
(
    id           text primary key,
    name         text not null,
    code         text not null,
	abbreviation text not null,
    color        text not null,
    tenant_id    text not null references tenants (id)
);

create table incidents
(
    id               text primary key,
    title            text      not null,
    code             text      not null,
    summary          text      not null,
    declared_at      timestamp not null,
    latest_status_id text      not null references incident_statuses (id),
    tenant_id        text      not null references tenants (id)
);

create table incident_role_slots
(
    id          text primary key,
    incident_id text      not null references incidents (id),
    role_id     text      not null references incident_roles (id),
    tenant_id   text      not null references tenants (id)
);
create index incident_role_slots__ti_ii_ri on incident_role_slots (tenant_id, incident_id, role_id);

create table incident_role_assignments
(
    id           text primary key,
    incident_id  text      not null references incidents (id),
    role_slot_id text      not null references incident_role_slots (id),
    user_id      text      not null references users (id),
    assigned_at  timestamp not null,
    assigned_by  text      null references users (id), -- システムユーザーではない人(workflowなど)が割り当てるケースがあるのでnullableは仕方ない
    tenant_id    text      not null references tenants (id)
);

create index incident_role_assignments__ti_ii_rsi on incident_role_assignments (tenant_id, incident_id, role_slot_id);

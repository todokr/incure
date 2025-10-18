insert into tenants (id, name)
values ('0000000000000000TENANT_001', 'Zarafa');

insert into users (id, family_name, given_name, tenant_id, status)
values ('00000000TEAM_ECOM_USER_001', 'Eコマース', '開発者1', '0000000000000000TENANT_001', 'ACTIVE')
     , ('00000000TEAM_ECOM_USER_002', 'Eコマース', '開発者2', '0000000000000000TENANT_001', 'ACTIVE')
     , ('00000000TEAM_ECOM_USER_003', 'Eコマース', '開発者3', '0000000000000000TENANT_001', 'DISABLED')
     , ('000000TEAM_KESSAI_USER_001', '決済', '開発者1', '0000000000000000TENANT_001', 'ACTIVE')
     , ('000000TEAM_KESSAI_USER_002', '決済', '開発者2', '0000000000000000TENANT_001', 'ACTIVE')
;

insert into user_emails (id, user_id, email, verified, tenant_id)
values ('00000000TEAM_ECOM_USER_001', '00000000TEAM_ECOM_USER_001', 'ecom-user1@example.com', true,
        '0000000000000000TENANT_001')
     , ('00000000TEAM_ECOM_USER_002', '00000000TEAM_ECOM_USER_002', 'ecom-user2@example.com', true,
        '0000000000000000TENANT_001')
     , ('00000000TEAM_ECOM_USER_003', '00000000TEAM_ECOM_USER_003', 'ecom-user3@example.com', false,
        '0000000000000000TENANT_001')
     , ('000000TEAM_KESSAI_USER_001', '000000TEAM_KESSAI_USER_001', 'kessai-user1@example.com', true,
        '0000000000000000TENANT_001')
     , ('000000TEAM_KESSAI_USER_002', '000000TEAM_KESSAI_USER_002', 'kessai-user2@example.com', true,
        '0000000000000000TENANT_001')
;

insert into user_hashed_passwords (id, user_id, hashed_password, tenant_id)
values ('00000000TEAM_ECOM_USER_001', '00000000TEAM_ECOM_USER_001',
        '$2b$10$GRG0VLXNwDlavJY9nCDUUehdFtJA2MwSHerGvG3PR6BaMFF2JPqv.', '0000000000000000TENANT_001')
     , ('00000000TEAM_ECOM_USER_002', '00000000TEAM_ECOM_USER_002',
        '$2b$10$GRG0VLXNwDlavJY9nCDUUehdFtJA2MwSHerGvG3PR6BaMFF2JPqv.', '0000000000000000TENANT_001')
     , ('00000000TEAM_ECOM_USER_003', '00000000TEAM_ECOM_USER_003',
        '$2b$10$GRG0VLXNwDlavJY9nCDUUehdFtJA2MwSHerGvG3PR6BaMFF2JPqv.', '0000000000000000TENANT_001')
     , ('000000TEAM_KESSAI_USER_001', '000000TEAM_KESSAI_USER_001',
        '$2b$10$GRG0VLXNwDlavJY9nCDUUehdFtJA2MwSHerGvG3PR6BaMFF2JPqv.', '0000000000000000TENANT_001')
     , ('000000TEAM_KESSAI_USER_002', '000000TEAM_KESSAI_USER_002',
        '$2b$10$GRG0VLXNwDlavJY9nCDUUehdFtJA2MwSHerGvG3PR6BaMFF2JPqv.', '0000000000000000TENANT_001')
;

insert into incident_statuses (id, name, status_type, color, tenant_id, is_active)
values ('1', 'インシデント検知', 'DECLARED', 'RED', '0000000000000000TENANT_001', true)
     , ('2', '対応開始', 'ONGOING', 'RED', '0000000000000000TENANT_001', true)
     , ('3', '緩和済', 'ONGOING', 'BLUE', '0000000000000000TENANT_001', true)
     , ('4', '解決', 'CLOSED', 'GREEN', '0000000000000000TENANT_001', true)
;

insert into incident_roles (id, name, code, abbreviation, color, tenant_id)
values ('1', 'インシデントコマンダー', 'incident-commander','IC', 'red', '0000000000000000TENANT_001')
     , ('2', 'コミュニケーションリード', 'communication-lead', 'CL', 'green', '0000000000000000TENANT_001')
     , ('3', 'オペレーター', 'operator', 'OP', 'blue', '0000000000000000TENANT_001')
;

insert into incidents (id, title, code, summary, tenant_id, declared_at, latest_status_id)
values ('1', 'カート機能が動かない', 'INC-1', 'カート機能が動かないという大変な事象が発生', '0000000000000000TENANT_001',
        '2025-01-01 09:00:00', '4')
     , ('2', '決済機能が動かない', 'INC-2', '決済機能が動かないという致命的な事象が発生', '0000000000000000TENANT_001', '2025-01-02 10:00:00',
        '3')
     , ('3', '請求機能が動かない', 'INC-3', '請求機能が動かない事象が発生
・ランサムウェア攻撃による身代金の要求
・標的型攻撃による機密情報の盗取
・SQLインジェクション攻撃による情報漏えい
・不正アクセスによるデータの改ざん・消去
・DDoS攻撃によるサーバダウン', '0000000000000000TENANT_001', '2025-01-03 11:00:00',
        '2')
;

insert into incident_role_slots (id, incident_id, role_id, tenant_id)
values ('1', '1', '1', '0000000000000000TENANT_001'),
       ('2', '1', '2', '0000000000000000TENANT_001'),
       ('3', '1', '3', '0000000000000000TENANT_001'),
       ('4', '2', '1', '0000000000000000TENANT_001'),
       ('5', '2', '2', '0000000000000000TENANT_001'),
       ('6', '2', '3', '0000000000000000TENANT_001'),
       ('7', '3', '1', '0000000000000000TENANT_001'),
       ('8', '3', '2', '0000000000000000TENANT_001'),
       ('9', '3', '3', '0000000000000000TENANT_001')
;

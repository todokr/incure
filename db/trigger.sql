create or replace function notify_event()
returns trigger as $$
begin
  raise notice 'event notified: %', json_build_object(
    'event_type', TG_ARGV[0],
    'new', row_to_json(new.*),
    'old', row_to_json(old.*)
  )::text;

  perform pg_notify(
    'event_channel',
    json_build_object(
      'event_type', TG_ARGV[0],
      'new', row_to_json(new.*),
      'old', row_to_json(old.*)
    )::text
  );
  return new;
end;
$$ language plpgsql;

drop trigger if exists emit_incident_create_event on incidents;

create trigger emit_incident_create_event
  after insert on incidents
  for each row
  execute function notify_event('incident_created');

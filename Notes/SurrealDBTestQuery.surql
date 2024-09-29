create test1:data1 content {
    "nama": "damir",
};
create test1:data2 content {
    "nama": "putri",
};
select * from test1;
relate test1:data1->hubungan_keluarga->test1:data2 set time.written= time::now(), hubungan='suami';
relate test2:data2->hubungan_keluarga->test1:data1 set time.written= time::now(), hubungan='istri';


select *, ->suami.in from test1 where ->suami.out;
select * from suami;
insert into test2 (select * from test1:data2);
select * from test2;
delete from suami, istri;
select * from test1:data2;

relate test1:data1->suami:putri->test2:data2 set time.written= time::now();
relate test2:data2->istri:damir->test1:data1 set time.written= time::now();
select * from istri;
delete from test1:data2;
select * from suami, istri;
update suami, istri set archived = false;


remove table suami;
 
select nama as asal, ->hubungan_keluarga[0].hubungan as hubungan_keluarga, ->hubungan_keluarga[0].out.nama as keluarga from test1, test2; 

delete test1:olive;
create test1:olive content {
    "nama": "olive"
};

remove table hubungan_keluarga;
relate test1:data1->hubungan_keluarga:suami_putri->test2:data2 set time.written= time::now(), hubungan='suami';
relate test1:data1<-hubungan_keluarga:istri_damir<-test2:data2 set time.written= time::now(), hubungan='istri';
relate test1:olive->hubungan_keluarga:anak_damir->test1:data1 set time.written = time::now(), hubungan='anak';
relate test2:olive->hubungan_keluarga:anak_putri->test2:data2 set time.written = time::now(), hubungan='anak';
relate test1:data1->hubungan_keluarga:papa_damir->test1:olive set time.written = time::now(), hubungan='papa';
relate test2:data2->hubungan_keluarga:mama_putri->test1:olive set time.written = time::now(), hubungan='mama';


select * from hubungan_keluarga;
update test1 set id='damir' where id='data1';
select 
    *
    ,->hubungan_keluarga.hubungan as hubungan_keluarga
    ,->hubungan_keluarga.out.nama as keluarga 
from 
    test1, 
    test2;

select * from hubungan_keluarga;
RETURN time::format(time::now()+7h, "%Y-%m-%d %T %Z");
let $timezone = RETURN time::timezone();
$timezone = return string::split($timezone, ':');

let $operatorplus = false;
$operatorplus = string::startsWith($timezone[0], '+');

let $selisih = return <duration>((<string>(<number> $timezone[0])+'h')+(<string>(<number> $timezone[1])+'m'));

if $operatorplus THEN
    RETURN time::format(time::now()+$selisih, "%Y-%m-%d %T %Z");
ELSE
    RETURN time::format(time::now()-$selisih, "%Y-%m-%d %T %Z");
END




define table chain;
create chain:step1 content {
    "data":"step1",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step2 content {
    "data":"step2",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step3 content {
    "data":"step3",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step4 content {
    "data":"step4",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step5 content {
    "data":"step5",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step6 content {
    "data":"step6",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step7 content {
    "data":"step7",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step8 content {
    "data":"step8",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step9 content {
    "data":"step9",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
create chain:step10 content {
    "data":"step10",
    "waktu":{
        "disimpan":time::now(),
        "timezone":time::timezone()
    }
};
delete from chain;
select * from chain;

remove function fn::connect_nodes;


remove function fn::connect_nodes;
DEFINE FUNCTION IF NOT EXISTS fn::connect_nodes(
    $node1:record,
    $node2:record
){
    let $result1 = RELATE $node1->connections->$node2 set time.disimpan = time::now(), hubungan='Next Process';
    let $result2 = RELATE $node1<-connections<-$node2 set time.disimpan = time::now(), hubungan='Previous Process';
    RETURN [$result1, $result2];
};
delete from connections;


return fn::connect_nodes(chain:step1, chain:step2);
return fn::connect_nodes(chain:step2, chain:step3);
return fn::connect_nodes(chain:step3, chain:step4);
return fn::connect_nodes(chain:step4, chain:step5);
return fn::connect_nodes(chain:step5, chain:step6);
return fn::connect_nodes(chain:step6, chain:step7);
return fn::connect_nodes(chain:step7, chain:step8);
return fn::connect_nodes(chain:step8, chain:step9);
return fn::connect_nodes(chain:step9, chain:step10);

select * from connections;

return 'NS: '+session::ns();
return 'DB: '+session::db();
return 'IP: '+session::ip();
return session::id();
return 'Origin: '+session::origin();

DEFINE EVENT init_metadata ON TABLE chain WHEN $event = "CREATE" 
THEN (
    UPDATE chain SET time.inserted = time::now() WHERE id = $after.post_id
);

info for table chain;

info for db;


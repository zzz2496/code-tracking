//OLD
DEFINE FUNCTION OVERWRITE fn::connect_nodes(
    $node1:record,
    $node2:record
){
    let $result1 = RELATE $node1->next_connection->$node2 set time.disimpan = time::now(), hubungan='Next Process';
    let $result2 = RELATE $node1<-previous_connection<-$node2 set time.disimpan = time::now(), hubungan='Previous Process';
    RETURN [$result1, $result2];
};

DEFINE FUNCTION OVERWRITE fn::connect_nodes_only(
    $node1:record,
    $node2:record
){
	LET $result1 = (RELATE ONLY $node1 -> next_connection -> $node2 SET time.disimpan = time::now(), hubungan = 'Next Process');
	LET $result2 = (RELATE ONLY $node2 -> previous_connection -> $node1 SET time.disimpan = time::now(), hubungan = 'Previous Process');
	RETURN [$result1, $result2];
};
DEFINE FUNCTION OVERWRITE fn::traverse_previous($el: record) {
    LET $parent = (SELECT VALUE (->previous_connection->chain)[0] FROM $el LIMIT 1)[0];

    IF $parent {
        RETURN array::prepend(fn::traverse_previous($parent), $parent)
    } ELSE {
        RETURN []
    };
};
DEFINE FUNCTION OVERWRITE fn::traverse_next($el: record) {
    LET $parent = (SELECT VALUE (->next_connection->chain)[0] FROM $el LIMIT 1)[0];

    IF $parent {
        RETURN array::prepend(fn::traverse_next($parent), $parent)
    } ELSE {
        RETURN []
    };
};
//OLD

DEFINE FUNCTION OVERWRITE fn::connect_nodes(
	$node1:record,
	$node2:record,
	$chain_id:string,
	$mode: "history" | "next_process" | "next_function" | "contains",
	$only: false
){
    IF !$only {
		IF $mode == "history" {
			return $result = (RELATE $node1 -> history -> $node2 SET time.connected = time::now(), connection_type = 'History', chain_id = $chain_id);
		} ELSE IF $mode == "next_process" {
			return $result = (RELATE $node1 -> next_process -> $node2 SET time.connected = time::now(), connection_type = 'Next Process', chain_id = $chain_id););
		} ELSE IF $mode == "next_function" {
			return $result = (RELATE $node1 -> next_function -> $node2 SET time.connected = time::now(), connection_type = 'Next Function', chain_id = $chain_id););
		} ELSE IF $mode == "contains" {
			return $result = (RELATE $node1 -> is_containing -> $node2 SET time.connected = time::now(), connection_type = 'Is Containing', chain_id = $chain_id););
		};
	} ELSE {
		IF $mode == "history" {
			return $result = (RELATE ONLY $node1 -> history -> $node2 SET time.connected = time::now(), connection_type = 'History', chain_id = $chain_id);
		} ELSE IF $mode == "next_process" {
			return $result = (RELATE ONLY $node1 -> next_process -> $node2 SET time.connected = time::now(), connection_type = 'Next Process', chain_id = $chain_id););
		} ELSE IF $mode == "next_function" {
			return $result = (RELATE ONLY $node1 -> next_function -> $node2 SET time.connected = time::now(), connection_type = 'Next Function', chain_id = $chain_id););
		} ELSE IF $mode == "contains" {
			return $result = (RELATE ONLY $node1 -> is_containing -> $node2 SET time.connected = time::now(), connection_type = 'Is Containing', chain_id = $chain_id););
		};
	}
}


DEFINE FUNCTION OVERWRITE fn::traverse($el: record, $mode: "prev" | "next") {
    IF $mode == "next" {
        $parent = (SELECT VALUE (->next_connection->chain)[0] FROM $el LIMIT 1)[0];

        IF $parent {
            RETURN array::prepend(fn::traverse($parent, $mode), $parent)
        } ELSE {
            RETURN []
        };  
    } ELSE {
        $parent = (SELECT VALUE (<-next_connection<-chain)[0] FROM $el LIMIT 1)[0];
        
        IF $parent {
            RETURN array::prepend(fn::traverse($parent, $mode), $parent)
        } ELSE {
            RETURN []
        };  
    };
};
select 
    *, 
    fn::traverse($this.id, "prev") as prev, 
    fn::traverse($this.id, "next") as next 
from chain;

return fn::connect_nodes(chain:data1_step01, chain:data1_step02);
return fn::connect_nodes(chain:data1_step02, chain:data1_step03);
return fn::connect_nodes(chain:data1_step03, chain:data1_step04);
return fn::connect_nodes(chain:data1_step04, chain:data1_step05);
return fn::connect_nodes(chain:data1_step05, chain:data1_step06);
return fn::connect_nodes(chain:data1_step06, chain:data1_step07);
return fn::connect_nodes(chain:data1_step07, chain:data1_step08);
return fn::connect_nodes(chain:data1_step08, chain:data1_step09);
return fn::connect_nodes(chain:data1_step09, chain:data1_step10);
return fn::connect_nodes(chain:data1_step10, chain:data1_step11);

return fn::connect_nodes(chain:data2_step01, chain:data2_step02);
return fn::connect_nodes(chain:data2_step02, chain:data2_step03);
return fn::connect_nodes(chain:data2_step03, chain:data2_step04);
return fn::connect_nodes(chain:data2_step04, chain:data2_step05);
return fn::connect_nodes(chain:data2_step05, chain:data2_step06);
return fn::connect_nodes(chain:data2_step06, chain:data2_step07);
return fn::connect_nodes(chain:data2_step07, chain:data2_step08);
return fn::connect_nodes(chain:data2_step08, chain:data2_step09);
return fn::connect_nodes(chain:data2_step09, chain:data2_step10);
return fn::connect_nodes(chain:data2_step10, chain:data2_step11);

return fn::connect_nodes(chain:data3_step01, chain:data3_step02);
return fn::connect_nodes(chain:data3_step02, chain:data3_step03);
return fn::connect_nodes(chain:data3_step03, chain:data3_step04);
return fn::connect_nodes(chain:data3_step04, chain:data3_step05);
return fn::connect_nodes(chain:data3_step05, chain:data3_step06);
return fn::connect_nodes(chain:data3_step06, chain:data3_step07);
return fn::connect_nodes(chain:data3_step07, chain:data3_step08);
return fn::connect_nodes(chain:data3_step08, chain:data3_step09);
return fn::connect_nodes(chain:data3_step09, chain:data3_step10);
return fn::connect_nodes(chain:data3_step10, chain:data3_step11);

return fn::connect_nodes(chain:data4_step01, chain:data4_step02);
return fn::connect_nodes(chain:data4_step02, chain:data4_step03);
return fn::connect_nodes(chain:data4_step03, chain:data4_step04);
return fn::connect_nodes(chain:data4_step04, chain:data4_step05);
return fn::connect_nodes(chain:data4_step05, chain:data4_step06);
return fn::connect_nodes(chain:data4_step06, chain:data4_step07);
return fn::connect_nodes(chain:data4_step07, chain:data4_step08);
return fn::connect_nodes(chain:data4_step08, chain:data4_step09);
return fn::connect_nodes(chain:data4_step09, chain:data4_step10);
return fn::connect_nodes(chain:data4_step10, chain:data4_step11);

return fn::connect_nodes(chain:data5_step01, chain:data5_step02);
return fn::connect_nodes(chain:data5_step02, chain:data5_step03);
return fn::connect_nodes(chain:data5_step03, chain:data5_step04);
return fn::connect_nodes(chain:data5_step04, chain:data5_step05);
return fn::connect_nodes(chain:data5_step05, chain:data5_step06);
return fn::connect_nodes(chain:data5_step06, chain:data5_step07);
return fn::connect_nodes(chain:data5_step07, chain:data5_step08);
return fn::connect_nodes(chain:data5_step08, chain:data5_step09);
return fn::connect_nodes(chain:data5_step09, chain:data5_step10);
return fn::connect_nodes(chain:data5_step10, chain:data5_step11);


remove function fn::connect_nodes;
delete from process_connections;
select * from process_connections;

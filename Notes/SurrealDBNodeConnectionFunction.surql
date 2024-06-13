# remove function fn::connect_process_nodes;
# DEFINE FUNCTION IF NOT EXISTS fn::connect_process_nodes(
#     $node1:record,
#     $node2:record
# ){
#     let $result1 = RELATE $node1->process_connections->$node2 set time.disimpan = time::now(), hubungan='Next Process';
#     let $result2 = RELATE $node1<-process_connections<-$node2 set time.disimpan = time::now(), hubungan='Previous Process';
#     RETURN [$result1, $result2];
# };
# 
# return fn::connect_process_nodes(chain:data1_step1, chain:data1_step2);
# return fn::connect_process_nodes(chain:data1_step2, chain:data1_step3);
# return fn::connect_process_nodes(chain:data1_step3, chain:data1_step4);
# return fn::connect_process_nodes(chain:data1_step4, chain:data1_step5);
# return fn::connect_process_nodes(chain:data1_step5, chain:data1_step6);
# return fn::connect_process_nodes(chain:data1_step6, chain:data1_step7);
# return fn::connect_process_nodes(chain:data1_step7, chain:data1_step8);
# return fn::connect_process_nodes(chain:data1_step8, chain:data1_step9);
# return fn::connect_process_nodes(chain:data1_step9, chain:data1_step10);
# return fn::connect_process_nodes(chain:data1_step10, chain:data1_step11);
# 
# return fn::connect_process_nodes(chain:data2_step1, chain:data2_step2);
# return fn::connect_process_nodes(chain:data2_step2, chain:data2_step3);
# return fn::connect_process_nodes(chain:data2_step3, chain:data2_step4);
# return fn::connect_process_nodes(chain:data2_step4, chain:data2_step5);
# return fn::connect_process_nodes(chain:data2_step5, chain:data2_step6);
# return fn::connect_process_nodes(chain:data2_step6, chain:data2_step7);
# return fn::connect_process_nodes(chain:data2_step7, chain:data2_step8);
# return fn::connect_process_nodes(chain:data2_step8, chain:data2_step9);
# return fn::connect_process_nodes(chain:data2_step9, chain:data2_step10);
# return fn::connect_process_nodes(chain:data2_step10, chain:data2_step11);
# 
# return fn::connect_process_nodes(chain:data3_step1, chain:data3_step2);
# return fn::connect_process_nodes(chain:data3_step2, chain:data3_step3);
# return fn::connect_process_nodes(chain:data3_step3, chain:data3_step4);
# return fn::connect_process_nodes(chain:data3_step4, chain:data3_step5);
# return fn::connect_process_nodes(chain:data3_step5, chain:data3_step6);
# return fn::connect_process_nodes(chain:data3_step6, chain:data3_step7);
# return fn::connect_process_nodes(chain:data3_step7, chain:data3_step8);
# return fn::connect_process_nodes(chain:data3_step8, chain:data3_step9);
# return fn::connect_process_nodes(chain:data3_step9, chain:data3_step10);
# return fn::connect_process_nodes(chain:data3_step10, chain:data3_step11);
# 
# return fn::connect_process_nodes(chain:data4_step1, chain:data4_step2);
# return fn::connect_process_nodes(chain:data4_step2, chain:data4_step3);
# return fn::connect_process_nodes(chain:data4_step3, chain:data4_step4);
# return fn::connect_process_nodes(chain:data4_step4, chain:data4_step5);
# return fn::connect_process_nodes(chain:data4_step5, chain:data4_step6);
# return fn::connect_process_nodes(chain:data4_step6, chain:data4_step7);
# return fn::connect_process_nodes(chain:data4_step7, chain:data4_step8);
# return fn::connect_process_nodes(chain:data4_step8, chain:data4_step9);
# return fn::connect_process_nodes(chain:data4_step9, chain:data4_step10);
# return fn::connect_process_nodes(chain:data4_step10, chain:data4_step11);
# 
# return fn::connect_process_nodes(chain:data5_step1, chain:data5_step2);
# return fn::connect_process_nodes(chain:data5_step2, chain:data5_step3);
# return fn::connect_process_nodes(chain:data5_step3, chain:data5_step4);
# return fn::connect_process_nodes(chain:data5_step4, chain:data5_step5);
# return fn::connect_process_nodes(chain:data5_step5, chain:data5_step6);
# return fn::connect_process_nodes(chain:data5_step6, chain:data5_step7);
# return fn::connect_process_nodes(chain:data5_step7, chain:data5_step8);
# return fn::connect_process_nodes(chain:data5_step8, chain:data5_step9);
# return fn::connect_process_nodes(chain:data5_step9, chain:data5_step10);
# return fn::connect_process_nodes(chain:data5_step10, chain:data5_step11);
# 

# remove function fn::connect_process_nodes;
# delete from process_connections;
# select * from process_connections;

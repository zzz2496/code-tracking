Features I'd like to have:
1. UI ←→ Dataset synchronization.
2. LocalStorage ←-→ DataStorage paradigm.
3. Garbage collection in the datastore.
4. DataStore hierarchy.
~~5. Realms (?), meaning what "mode" are you in within the web app.  [nomor 16, element shift_up/shift_down]
6. Colors and Themes !!!
7. Dataset always have a hash pair, LocalStorage vs DataStorage comparison done through hash table comparison.
8. Perspectives, I need PERSPECTIVES:
	- KANBAN PERSPECTIVE in dataset and chronological data history about EVERYTHING.
	- CALENDAR PERSPECTIVE
    - TABLE PERSPECTIVE
    - GRAPH PERSPECTIVE
11. Data IMPORT and EXPORT.
12. System components is going from LEFT → RIGHT. Go back to the LEFT, go forward to the RIGHT. Helpers are from the bottom (USER MANUAL, GUIDES, etc).
13. Elevation = elevate in the GUI, the "layer" comes up + change of colors to RED?
14. Colors, each "steps" of the system has it's own significant "Color Theme".
15. Modules definition in JSON. Primary modules as files, user generated modules as database stored values?
16. No direct javascript coding?
17. NODE BASED PROGRAMMING?
18. Node/module parts/links to other modules/parts, linked list-like configuration:
```js
 node = {
 	"loccation":{//node links, similar to linked list links
		"shift_up": link_to_node>,
		"shift_down": link_to_node>,
		"up": link_to_node>,
		"down": link_to_node>,
		"left": link_to_node>, 
		"right": link_to_node>
	}, 
	"helpers":{ //node helpers, how to use, complementary units/modules made out from other node elements.
		"user_manual": generated_from_configuration(),
		"dataset_elements": link_to_node[element]>
	},
	"configuration":{}
}
 ```
 17.System elements: HTML descriptors, CSS descriptors?
18. ![[Pasted image 20211117152416.png]]
 
 ![[Pasted image 20230109164912.png]]
 
 Command to start SurrealDB
 surreal start --log trace --user root --pass root --bind 0.0.0.0:8080 file:testdb.db
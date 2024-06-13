Object based system.  
Punya komponen2 berikut:  
1. Query
2. Schema
3. Dataset -> Ports, DataProcessing
	1. Type: [" Array", "Object"]
	2. Data: {}
	3. DataTemplate:
		1. Layout
		2. Data
	4. DataType
	5. DataState
4. DefaultPerspective -> Perspectives
5. DefaultView -> Render
6. Form -> Perspective.DataInteractive.Form()
7. Time
	1. Transactional
		1. Created
		2. Transacted
		3. Saved
	2. Historical
8. Relations
	1. Familial
		1. Parent
		2. Descendant
		3. Siblings
	2. Historical
		1. Past
		2. Future
9. LatestVersion
10. PerspectiveSettings
	1. DataInteractivity -> ["DataInteractive",  "DataView"]
	2. Configuration:
		1. Form
			1. ColumnList
			2. ColumnLayoutConfiguration
		2. DataGrid
			1. ColumnList
			2. ColumnContentType -> ["label", "input", "textarea", "button"]
			3. ColumnLayoutConfiguration
		3. List
			1. ColumnList
			2. ColumnLayoutConfiguration
		4. Table
			1. ColumnList
			2. ColumnLayoutConfiguration
		5. Grid
			1. ColumnList
			2. ColumnLayoutConfiguration
		6. Cards
			1. Tiny
				1. ColumnList
				2. ColumnLayoutConfiguration
			2. Small
				1. ColumnList
				2. ColumnLayoutConfiguration
			3. Normal
				1. ColumnList
				2. ColumnLayoutConfiguration
			4. Large
				1. ColumnList
				2. ColumnLayoutConfiguration
			5. Extra Large
				1. ColumnList
				2. ColumnLayoutConfiguration
		7. Kanban Board
			1. ColumnList
			2. ColumnLayoutConfiguration
		8. Calendar
			1. ColumnList
			2. ColumnLayoutConfiguration
		9. Graph
			1. ColumnList
			2. ColumnLayoutConfiguration
		10. GraphRelations
			1. ColumnList
			2. ColumnLayoutConfiguration
		11. CSV
			1. ColumnList
			2. ColumnLayoutConfiguration

Punya method2 berikut:  
1. Initialize
2. DataProcessing
	1. Statistics
		1. Average
		2. Max
		3. Min
		4. Count
	2. Filter
	3. Sort
	4. Refresh -> Ports.Input.Get()
3. Ports
	1. Input
		1. Init
		2. Get
		3. Append
		4. Delete
	2. Output
		1. asHML  -> Render.Perspectives.[x]
		2. asJSON -> Dataset.data
		3. asCSV 
4. Render
	1. Refresh
	2. Perspectives:
		1. DataInteractive
			1. Form
			2. DataGrid
		2. DataView
			1. List
			2. Table
			3. Grid
			4. Cards
				1. Tiny
				2. Small
				3. Normal
				4. Large
				5. Extra Large
			5. Kanban Board
			6. Calendar
			7. Graph
			8. GraphRelations
			9. CSV
	3. Output
5. Destroy  

import csvwriter from 'csv-writer'

var createCsvWriter = csvwriter.createObjectCsvWriter

// Passing the column names intp the module
const csvWriter = createCsvWriter({

// Output csv file name is geek_data
path: 'geek_data.csv',
header: [

	// Title of the columns (column_names)
	{id: 'id', title: 'ID'},
	{id: 'name', title: 'NAME'},
	{id: 'age', title: 'AGE'},
]
});

// Values for each column through an array
const results = [
{
	id: '7058',
	name: 'Sravan Kumar Gottumukkala',
	age: 22
}, {
	id: '7004',
	name: 'Sudheer',
	age: 29
}, {
	id: '7059',
	name: 'Radha',
	age: 45
},{
	id: '7060',
	name: 'vani',
	age: 34
}
	
];
// Writerecords function to add records
csvWriter
.writeRecords(results)
.then(()=> console.log('Data uploaded into csv successfully'));

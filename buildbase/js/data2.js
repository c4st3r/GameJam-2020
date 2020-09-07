d.tasks = 
	{
		lakewater: {
			type: "gather",
			tab: "scavenge",
			name: "Lake water", 
			log: "Found a muddy lake near the camp.",
			title: "Extract water from the lake",
			desc: "The dirty brown water is not suitable for drinking.",
			effort: "1000",
			durability: -1,
			loot: [
				{id: "dirtywater", count: 3}
			],
			ntasks: [
				{id: "boilwater", maxglob: 1}
			],
		},
		
		wheatfield: {
			type: "gather",
			tab: "scavenge",
			name: "Wheat field",
			title: "Harvest wheat from the field",
			log: "Found a field of wheat.",
			effort: "500",
			durability: -1,
			loot: [
				{id: "wheat", count: 2}
			],
			ntasks: [
				{id: "makebread", maxglob: 1}
			],
		},
		
		cuttrees: {
			type: "gather",
			tab: "scavenge",
			name: "Forest",
			title: "Cut trees for wood.",
			log: "Found a large lush forest.",
			effort: "2000",
			durability: -1,
			loot: [
				{id: "wood", count: 2},
				{id: "wood", count: 4, prob: 0.5}
			],
		},
		
		buildcampfire: {
			type: "build",
			tab: "craft",
			name: "Campfire",
			title: "Lit the campfire",
			desc: "Getting fire up and running will let you cook meat for food.",
			log: "There is a firepit but the fire is out.",
			effort: "1000",
			durability: 1,
			requires: [
				{id: "wood", count: 8}
			],
			loot: [
				{id: "campfire", count: 1}
			],
		},
		
		makebread: {
			type: "cook",
			tab: "cook",
			name: "Bake bread",
			title: "Bake bread",
			effort: "1000",
			durability: -1,
			food: {min: 4, max: 6},
			tech: [
				{id: "campfire", count: 1}
			],
			requires: [
				{id: "wheat", count: 2}
			],
		},

		boilwater: {
			type: "cook",
			tab: "cook",
			name: "Boil water",
			title: "Boil dirty water",
			description: "After boiling the water it becomes drinkable.",
			effort: "500",
			durability: -1,
			water: {min: 3, max: 5},
			tech: [
				{id: "campfire", count: 1}
			],
			requires: [
				{id: "dirtywater", count: 1}
			]
		},
	}
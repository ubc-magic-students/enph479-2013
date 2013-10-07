package com.ubc.magic.enph479.builder;

import java.util.LinkedHashSet;
import java.util.Random;
import java.util.Set;

public class UniqueRandomNumberGenerator {
	private final Random random = new Random();
	private final int range;
	Set<Integer> generated = new LinkedHashSet<Integer>();
	
	public UniqueRandomNumberGenerator(int range) {
		this.range = range;
	}
	
	public int nextInt() {
		if (generated.size() == range)
			generated.clear();
		while(true ) {
			int r = random.nextInt(range);
			if (generated.add(r))
				return r;
		}
	}
	  
}

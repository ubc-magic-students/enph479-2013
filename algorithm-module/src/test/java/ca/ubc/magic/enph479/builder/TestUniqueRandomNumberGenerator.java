package ca.ubc.magic.enph479.builder;

import static org.junit.Assert.assertFalse;

import java.util.LinkedHashSet;
import java.util.Set;

import org.junit.Test;

public class TestUniqueRandomNumberGenerator {
	
	@Test
	public void testUniquenessOfRandomNumbers() {
		int range = 6;
		UniqueRandomNumberGenerator random = new UniqueRandomNumberGenerator(range);
		Set<Integer> generated = new LinkedHashSet<Integer>();
		for (int i = 0; i < range; i++) {
			generated.add(random.nextInt());
		}
		
		for (int i = 0; i < range; i++) {
			assertFalse(generated.add(i));
		}
		
	}
	
	
}

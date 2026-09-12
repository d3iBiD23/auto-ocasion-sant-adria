package es.autoocasion;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Creates the two external-channel records for stock that existed before this feature. */
@Configuration
class PublicationSetup {
  @Bean
  CommandLineRunner initializePublicationChannels(VehicleRepository vehicles) {
    return args -> vehicles.findAll().forEach(vehicle -> {
      for (PublicationChannel channel : PublicationChannel.values()) {
        boolean exists = vehicle.publications.stream().anyMatch(item -> item.channel == channel);
        if (!exists) {
          VehiclePublication item = new VehiclePublication();
          item.vehicle = vehicle;
          item.channel = channel;
          vehicle.publications.add(item);
        }
      }
      vehicles.save(vehicle);
    });
  }
}

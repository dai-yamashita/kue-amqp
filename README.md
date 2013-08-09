kue-amqp
========

An implementation of Kue that sits on top of AMQP. Long-term this may end up just being a patch for Kue.

## Configuration

The following options can be set in you configuration files:

```yaml
kue:

  queueName: <yourQueueName>
```

The `queueName` value determines the name of the queue in SQS.
